<?php

$shop_id = 28;
$product_id = 29;
$token = "fd8cd15ffdd90fe58188f297401e604c";

$order = array( 
  "contact_information" => array(
    "name" => $_POST["name"],
    "country_code" => $_POST["country_code"],
    "address" => $_POST["address"],
    "zip_code" => "",
    "phone_number" => $_POST["phone"]
  ),
  "cart" => array(
    "items" => array(
      array(
        "count" => 1,
        "product_id" => $product_id
      )
    )
  ),
  "referal" => array(
    "webmaster_personal_key" => $_COOKIE["webmaster_personal_key"]
  )
);


class UpnApi {
  private $authToken = '6b92580f49763693391b5a1de86c5c65';
  private $api_url = 'http://188.166.16.61/api/shops/v1/shops/';

  function __construct($authToken, $shop_id) {
    $this->authToken = $authToken;
    $this->shop_id = $shop_id;
  }

  function createOrder($params) {
    $resp = $this->makePost('orders', $this->wrapEntity($params, 'order'));
  }

  private

    function makePost($action, $params) {
      $url = $this->api_url.$this->shop_id.'/';
      $curl = curl_init();
      curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $url.$action,
        CURLOPT_USERAGENT => 'UpnApi v1.1',
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
      return json_encode($data);
    }
}

$client = new UpnApi($token, $shop_id);
$client->createOrder($order);

header('Location: /index.html');
die();
?>
