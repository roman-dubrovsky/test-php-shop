<?php

require 'config.php';

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
  function __construct($authToken, $shop_id, $api_url) {
    $this->authToken = $authToken;
    $this->shop_id = $shop_id;
    $this->api_url = $api_url;
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

$client = new UpnApi($token, $shop_id, $api_url);
$client->createOrder($order);

$message = "Ваш заказ принят. Спасибо за покупку!";
header('Content-Type: text/html;charset=utf-8');
echo "<script type='text/javascript'>alert('$message');</script>";
header('refresh:0; url=index.html');
die();
?>
