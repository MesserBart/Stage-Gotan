#! /bin/bash
set -e

# VARIABLES GLOBALES****************************************************

longueur=`cat 'backup-config.json' | jq '.machines|length'`
date=$(date +%d%m%Y)
port=22
precommand=`cat 'backup-config.json' | jq -r '.machines[2].precommand'`
logfile=/var/log/backup.log
export AnException=100
export AnotherException=101
function catch()
{
    export ex_code=$?
    (( $SAVED_OPT_E )) && set +e
    return $ex_code
}
function try()
{
    [[ $- = *e* ]]; SAVED_OPT_E=$?
    set +e
}
function throw()
{
    exit $1
}
function throwErrors()
{
    set -e
}

function ignoreErrors()
{
           set +e
}

#DEBUT DU SCRIPT
    for (( i = 0 ; i < $longueur ; i++ ))
    do
    #VARIABLES LOCALES
        echo "variable i " $i
        duration=`cat 'backup-config.json' | jq '.machines['$i'].duration'`
        cible=`cat 'backup-config.json' | jq -r '.machines['$i'].addr'`
        dossier=`cat 'backup-config.json' | jq -r '.machines['$i'].path'`
        nommach=`cat 'backup-config.json' | jq -r '.machines['$i'].name'`
        dossierfin=`cat 'backup-config.json' | jq -r '.machines['$i'].name'`
        presence=`cat 'backup-config.json' | jq -r '.machines['$i'].precommand'`
        save="$nommach.$date.tar.gz"
        precommand=`cat 'backup-config.json' | jq -r '.machines['$i'].precommand'`
        echo $save
        try
        (

        #CONNEXION ET ARCHIVE****************************************************
        echo "Creation du Script ...................."
        filename="$nommach$date.script.sh"
        touch $filename                                                                                                                                                                                                                                                                rm $filename
        echo "#! /bin/bash" >> $filename
        if [[ $presence != null ]] ;
        then 
            echo $precommand >> $filename
        fi
        echo "cd /"$dossier >> $filename
        echo "tar -cvf "$save" /"$dossierfin >> $filename
        echo "move "$save" /var/log/"$save  >> $filename
        chmod +x $filename
        echo "Upload du Script ...................."
        scp -r -p $filename root@$cible:/root/myscript > /dev/null
        echo "Execution du Script ...................."
        ssh root@$cible -p $port './myscript' > /dev/null 2>&1
        if [[ $? != 0 ]] ;
        then
            throw $AnException
        fi

        #RECUPERATION DU BACKUP****************************************************
        echo "Recupertion du backup ......................"
        scp -r -p root@$cible:/var/log/$save /var/backups/$dossierfin/$save > /dev/null 2>&1
        if [[ $? != 0 ]];
        then

            throw $BackupException
        fi

        # SUPPRESSION D'UN FICHIER VIEUX DE $duration JOURS **********************
        echo "Cleanup ......................"
        rm $filename
        find /var/backups/$dossierfin/ -mtime +$duration -delete > /dev/null 2>&1
        if [[$? != 0 ]];
        then
            throw $InternException
        fi
        taille=`wc -c $save`
        echo " Backup de  $nommmach $cible le $date : fichier $save de $taille octets." >> $logfile

        )
        catch || {
            case $ex_code in
                    $AnException)
                        error="ssh root@$cible -p $port $precommand"
                        slack-notification "Erreur signalée : $error" IT warning
                    ;;
                    $AnotherException)
                        error="ssh root@$cible -p $port tar -cvf backup.tar"
                        slack-notification "Erreur signalée : $error" IT warning
                    ;;
                    $BackupException)
                        error="scp -r -p root@$cible:/root/backup.tar /var/backups/$dossierfin/$save"
                        slack-notification "Erreur signalée : $error" IT warning                                                                                                                                                                                                       ;;
                    $InternException)
                        error="find /var/backups/$dossierfin/ -mtime +$duration -delete"
                        slack-notification "Erreur signalée : $error" IT warning
                    ;;
                    *)
                        slack-notification "Erreur inconnue signalée." IT warning
                        throw $ex_code # you can rethrow the "exception" causing the script to exit if not caught
                    ;;
            esac
                }
    done