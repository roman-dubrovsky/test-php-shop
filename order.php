<?php

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$order = array(
  "id" => generateRandomString(),
  "contact_information" => array(
    "name" => $_POST["name"],
    "country_code" => $_POST["country_code"],
    "address" => $_POST["address"],
    "zip_code" => "220000",
    "phone_number" => $_POST["phone"]
  ),
  "cart" => array(
    "items" => array(
      array(
        "name" => "Чай от простатита",
        "count" => 1,
        "price" => 300000,
        "currency" => "BYR"
      )
    )
  )
);


class UpnApi {
  private $authToken = '';
  private $api_url = 'http://hotnetwork.org/api/v1/';

  function __construct($authToken) {
    $this->authToken = $authToken;
  }

  function createOrder($params) {
    $resp = $this->makePost('orders', $this->wrapEntity($params, 'order'));
  }

  private

    function makePost($action, $params) {
      $curl = curl_init();
      curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $this->api_url.$action,
        CURLOPT_USERAGENT => 'UpnApi v0.1',
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => $this->jsonData($params),
        CURLOPT_HTTPHEADER => array(
          'Content-Type: application/json',
          'Content-Length: '.strlen($this->jsonData($params)),
          'Authorization: Token token='.$this->authToken
        )
      ));

      $resp = curl_exec($curl);
      curl_close($curl);
      return $resp;
    }

    function wrapEntity($entity, $root) {
      return array($root => $entity);
    }

    // TODO: Cache this
    function jsonData($data) {
      return json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}

$client = new UpnApi("6b92580f49763693391b5a1de86c5c65");
$client->createOrder($order);

echo("Спасибо за заказ, ".$_POST["name"]."!");
?>
