<?php
namespace App\Services;

use Firebase\JWT\JWT;
use App\Entity\User;

class JwtAuth
{
	public $manager;
	public $key;

	public function __construct($manager)
	{
		$this->manager = $manager;
		$this->key = 'AQUIHAYQUEGENERARALGOMUYSEGURO1!';
	}

	public function signUp($email, $password, $getToken = null)
	{
		// Comprobar si usuario existe
		$user = $this->manager->getRepository(User::class)->findOneBy([
			'email' => $email,
			'password' => $password
		]);

		$isSignedUp = is_object($user) ? true : false;

		// Generar token
		if ($isSignedUp) {
			$token = [
				'sub' => $user->getId(),
				'name' => $user->getName(),
				'lastname' => $user->getLastName(),
				'email' => $user->getEmail(),
				'iat' => time(),
				'exp' => time() + 7 * 24 * 60 * 60
			];

			$jwt = JWT::encode($token, $this->key, 'HS256');

			// comprobar flag gettoken
			if (!empty($getToken)) {
				$data = $jwt;
			} else {
				$decoded = JWT::decode($jwt, $this->key, ['HS256']);
				$data = $decoded;
			}
		} else {
			$data = 'error';
		}

		// Devolver datos
		return $data;
	}

	public function checkToken($jwt)
	{
		$auth = false;

		try {
			$decoded = JWT::decode($jwt, $this->key, ['HS256']);
			if (
				isset($decoded) &&
				!empty($decoded) &&
				is_object($decoded) &&
				isset($decoded->sub)
			) {
				$auth = true;
			}
		} catch (\UnexpectedValueException $th) {
			$auth = false;
		} catch (\DomainException $e) {
			$auth = false;
		}

		return $auth;
	}
}
