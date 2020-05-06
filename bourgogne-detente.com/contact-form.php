<?php 


$recipient = "damien.cuvillier@gotan.io";

$name = isset($_POST['name'])?$_POST['name']:null;
$tel = isset($_POST['tel'])?$_POST["tel"]:null;
$email = isset($_POST['email'])?$_POST["email"]:null;
$subject = isset($_POST['subject'])?$_POST["subject"]:null;
$message = isset($_POST['message'])?$_POST["message"]:null;

if ($tel == null || $name == null || $subject == null || $message == null){
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	die("Missing parameter");
}


$mailHeader = "From: \"$name\"<$email>\n";
$mailHeader .= "Content-Type: text/html; charset=\"iso-8859-1\"";

$formContent="<div style='background-color:#EEEEEE;width: 100%; max-width:600px;padding: 20px;'>";

$formContent .="<div style='line-height: 30px; font-size: 12pt'>De: <strong>$name</strong></div>";
$formContent .="<div style='line-height: 30px; font-size: 12pt'>Téléphone: <strong><a href='tel:$tel'>$tel</a></strong></div>";
if($email != null)
$formContent .="<div style='line-height: 30px; font-size: 12pt'>E-Mail: <strong><a href='mailto:$email'>$email</a></strong></div>";

$formContent .="<div style='line-height: 30px; font-size: 12pt'><u>Objet:</u> <strong>$subject</strong></div>";

$formContent .="<div style=' white-space:pre;background-color:#FFFFFF; padding: 10px;line-height: 20px; font-size: 12pt;margin: 5px 0'>$message</div>";

$formContent .="<p style='text-align:left;font-size: 8pt'>Message envoyé depuis wiart-construction.fr</p></div>";


$ok = mail($recipient, $subject, $formContent, $mailHeader);

if (!$ok){
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	die("Unable to send email");
}