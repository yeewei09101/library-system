<?php
$db_host = "localhost";
$db_user = "root";
$db_pwd = "";
$db_name = "PSS";

//Cipta sanbungan ke pangkalan data
$conn = mysqli_connect($db_host, $db_user, $db_pwd, $db_name);

//Semak sanbungan
//Jika tak berjaya, keluarga mesej ralat
if (!$conn) {
    die(mysqli_connect_error());
}
//echo "Sambungan ke pangkalan data berjaya";
?>