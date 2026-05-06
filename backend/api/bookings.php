<?php
require_once "../config/database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true);
}

try {
    if ($method === "GET") {
        $stmt = $pdo->query("SELECT * FROM bookings ORDER BY id DESC");
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $bookings
        ]);
        exit;
    }

    if ($method === "POST") {
        $data = getJsonInput();

        $stmt = $pdo->prepare("
            INSERT INTO bookings 
            (guest_name, email, phone, room_type, guests, check_in, check_out, status, notes)
            VALUES 
            (:guest_name, :email, :phone, :room_type, :guests, :check_in, :check_out, :status, :notes)
        ");

        $stmt->execute([
            ":guest_name" => $data["guest_name"],
            ":email" => $data["email"],
            ":phone" => $data["phone"],
            ":room_type" => $data["room_type"],
            ":guests" => $data["guests"],
            ":check_in" => $data["check_in"],
            ":check_out" => $data["check_out"],
            ":status" => $data["status"],
            ":notes" => $data["notes"]
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Booking created successfully"
        ]);
        exit;
    }

    if ($method === "PUT") {
        $id = $_GET["id"] ?? null;
        $data = getJsonInput();

        if (!$id) {
            echo json_encode([
                "success" => false,
                "message" => "Booking ID is required"
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE bookings SET
                guest_name = :guest_name,
                email = :email,
                phone = :phone,
                room_type = :room_type,
                guests = :guests,
                check_in = :check_in,
                check_out = :check_out,
                status = :status,
                notes = :notes
            WHERE id = :id
        ");

        $stmt->execute([
            ":id" => $id,
            ":guest_name" => $data["guest_name"],
            ":email" => $data["email"],
            ":phone" => $data["phone"],
            ":room_type" => $data["room_type"],
            ":guests" => $data["guests"],
            ":check_in" => $data["check_in"],
            ":check_out" => $data["check_out"],
            ":status" => $data["status"],
            ":notes" => $data["notes"]
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Booking updated successfully"
        ]);
        exit;
    }

    if ($method === "DELETE") {
        $id = $_GET["id"] ?? null;

        if (!$id) {
            echo json_encode([
                "success" => false,
                "message" => "Booking ID is required"
            ]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = :id");
        $stmt->execute([":id" => $id]);

        echo json_encode([
            "success" => true,
            "message" => "Booking deleted successfully"
        ]);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error occurred"
    ]);
}
?>