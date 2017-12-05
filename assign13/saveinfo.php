<?php
  $fname = $_POST['fname'];
  $lname = $_POST['lname'];
  $email = $_POST['email'];
  $insert = "insert into USERINFO values('$fname','$lname','$email')";// Do Your Insert Query
  if(mysql_query($insert)) {
   echo "Success";
  } else {
   echo "Cannot Insert";
  }
?>
