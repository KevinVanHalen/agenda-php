<?php
    
    function obtenerContactos() {
        include 'db.php';
            try {
                return $conn->query("SELECT id, nombre, empresa, telefono FROM contactos");
            } catch (Exception $e) {
                echo "Error!!" . $e->getMessage() . "<br>";
                return false;
            }
        }