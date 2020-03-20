<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Entity\User;
use App\Entity\Video;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validation;

use App\Services\JwtAuth;

class UserController extends AbstractController
{
	public function index()
	{
		$user_repo = $this->getDoctrine()->getRepository(User::class);
		$video_repo = $this->getDoctrine()->getRepository(Video::class);

		$users = $user_repo->findAll();
		$videos = $video_repo->findAll();

		// foreach ($users as $user) {
		// 	echo "<h1>{$user->getName()} {$user->getLastname()}</h1>";

		// 	foreach ($user->getVideos() as $video) {
		// 		echo "<p>{$video->getTitle()} - {$video->getUser()->getEmail()}</p>";
		// 	}
		// }

		$user = $user_repo->find(1);
		$video = $video_repo->find(1);

		// return new JsonResponse($videos);
		return $this->resJson($videos);
		// var_dump($user);
		// die();
		// return $this->json([
		// 	'message' => 'Welcome to your new controller!',
		// 	'path' => 'src/Controller/UserController.php'
		// ]);
	}

	public function create(Request $req)
	{
		// Recoger datos post
		$json = $req->get('json', null);
		// decodificar json
		$params = json_decode($json);
		// Respuesta por defecto
		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_BAD_REQUEST,
			'message' => 'El usuario no se ha creado.'
		];
		// Comprobar y validar datos
		if ($json) {
			$name = !empty($params->name) ? $params->name : null;
			$lastname = !empty($params->lastname) ? $params->lastname : null;
			$email = !empty($params->email) ? $params->email : null;
			$password = !empty($params->password) ? $params->password : null;

			$validator = Validation::createValidator();
			$validate_email = $validator->validate($email, [new Email()]);

			if (
				!empty($email) &&
				count($validate_email) == 0 &&
				!empty($password) &&
				!empty($name) &&
				!empty($lastname)
			) {
				// Si validacion correcta crear usuario
				$user = new User();
				$user->setName($name);
				$user->setLastname($lastname);
				$user->setEmail($email);
				$user->setRole('ROLE_USER');
				$user->setCreatedAt(new \DateTime('now'));

				// cifrar password
				$password = hash('sha256', $password);
				$user->setPassword($password);

				// Compobrar si usuario existe (duplicado)
				$doctrine = $this->getDoctrine();
				$em = $doctrine->getManager();

				$user_repo = $doctrine->getRepository(User::class);
				$isset_user = $user_repo->findBy(array('email' => $email));

				// si no existte guradarlo en bd
				if (count($isset_user) == 0) {
					// guardo bd
					$em->persist($user);
					$em->flush();

					$data['status'] = 'ok';
					$data['code'] = JsonResponse::HTTP_CREATED;
					$data['message'] = 'Usuario creado';
					$data['user'] = $user;
					// respuesta json
					return new JsonResponse($data, JsonResponse::HTTP_CREATED);
				} else {
					$data['message'] = 'El usuario ya existe';
				}
			} else {
				$data['message'] = 'Validacion incorrecta';
			}
		}

		return new JsonResponse($data, JsonResponse::HTTP_BAD_REQUEST);
	}

	public function login(Request $req, JwtAuth $jwtAuth)
	{
		// REspuesta por defecto
		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_BAD_REQUEST,
			'message' => 'Las credenciales no son validas.'
		];

		// Recibir datos
		$json = $req->get('json', null);
		$params = json_decode($json);

		// Comprobar y validar datos
		if ($json) {
			$email = !empty($params->email) ? $params->email : null;
			$password = !empty($params->password) ? $params->password : null;
			$getToken = !empty($params->token) ? $params->token : null;

			$validator = Validation::createValidator();
			$validate_email = $validator->validate($email, [new Email()]);

			if (!empty($email) && !empty($password) && count($validate_email) == 0) {
				// Cifrar password
				$password = hash('sha256', $password);
				// Si es valido , llamar servicio para identificar user con jwt
				if ($getToken) {
					$signup = $jwtAuth->signUp($email, $password, $getToken);
				} else {
					$signup = $jwtAuth->signUp($email, $password);
				}

				// si todo va bien respuesta
				if ($signup == 'error') {
					$data['status'] = 'error';
					$data['message'] = 'Error al iniciar sesion.';
				} else {
					$data['status'] = 'ok';
					$data['code'] = JsonResponse::HTTP_OK;
					$data['data'] = $signup;
					unset($data['message']);
				}
			}
		}

		return new JsonResponse($data, $data['code']);
	}

	public function edit(Request $req, JwtAuth $jwtAuth)
	{
		// Recoger cabecera de autenticacion
		$token = $req->headers->get('Authorization');

		// metodo para comprpbar token
		$auth = $jwtAuth->checkToken($token);

		// si es correcto actualizar datos
		if ($auth) {
			// Actualizar user
			// Conseguir entity manager
			// Obtener datos del usuario identificado
			// Conseguir el usuario a actualizar
			// Recoger datos post
			// Comprobar y validar datos
			// Asignar datos nuevos
			// Comprobar duplicados
			// Guardar cambios
		}

		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_BAD_REQUEST,
			'message' => 'Metodo edit',
			'token' => $auth
		];

		return new JsonResponse($data, $data['code']);
	}

	private function resJson($data)
	{
		// Serializar datos con serializer
		$json = $this->get('serializer')->serialize($data, 'json');

		// response con httpfoundation
		$response = new Response();

		// asignar contenido a respuesta
		$response->setContent($json);

		// content type de la respuesta
		$response->headers->set('Content-Type', 'application/json');

		// devolver respuesta
		return $response;
	}
}
