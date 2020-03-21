<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Entity\User;
use App\Entity\Video;

use Knp\Component\Pager\PaginatorInterface;
use App\Services\JwtAuth;

class VideoController extends AbstractController
{
	public function index()
	{
		return $this->json([
			'message' => 'Welcome to your new controller!',
			'path' => 'src/Controller/VideoController.php'
		]);
	}

	public function new(Request $req, JwtAuth $jwtAuth, $id = null)
	{
		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_BAD_REQUEST,
			'message' => 'No se ha credo el video.'
		];
		// Recoger token
		$token = $req->headers->get('Authorization');

		// comprobar token
		$auth = $jwtAuth->checkToken($token, true);
		if (!$auth) {
			$data['message'] = 'No esta autorizado para realizar esta accion.';
			$data['code'] = JsonResponse::HTTP_UNAUTHORIZED;
			return new JsonResponse($data, $data['code']);
		}

		// Recoger dtos post
		$json = $req->get('json', null);
		$params = json_decode($json);

		// Recoger datos de usuario identificado
		$identity = $jwtAuth->checkToken($token, true);

		//Comprobar y validar datos
		if (!empty($json)) {
			$user_id = !is_null($identity->sub) ? $identity->sub : null;
			$title = !empty($params->title) ? $params->title : null;
			$description = !empty($params->description) ? $params->description : null;
			$url = !empty($params->url) ? $params->url : null;

			if (!empty($user_id) && !empty($title) && !empty($url)) {
				$em = $this->getDoctrine()->getManager();
				$user = $this->getDoctrine()
					->getRepository(User::class)
					->findOneBy(['id' => $user_id]);

				if (is_null($id)) {
					// crear y guardar el nuevo video favorito
					$video = new Video();
					$video->setUser($user);
					$video->setTitle($title);
					$video->setDescription($description);
					$video->setUrl($url);
					$video->setStatus('normal');

					$time = new \DateTime('now');
					$video->setCreatedAt($time);
					$video->setUpdatedAt($time);

					//Guardar el video
					$em->persist($video);
					$em->flush($video);

					$data['message'] = 'El video ha sido añadido';
					$data['video'] = $video;
					$data['status'] = 'ok';
					$data['code'] = JsonResponse::HTTP_CREATED;
				} else {
					// Actualizar video
					$video = $em
						->getRepository(Video::class)
						->findOneBy(['id' => $id, 'user' => $identity->sub]);
					if ($video && is_object($video)) {
						$video->setTitle($title);
						$video->setDescription($description);
						$video->setUrl($url);

						$time = new \DateTime('now');
						$video->setUpdatedAt($time);

						//Guardar el video
						$em->persist($video);
						$em->flush($video);
					}
					$data['status'] = 'ok';
					$data['message'] = 'El video ha sido actualizado';
					$data['video'] = $video;
				}
			}
		}

		return $this->resJson($data);
	}

	public function list(Request $req, JwtAuth $jwtAuth, PaginatorInterface $paginator)
	{
		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_BAD_REQUEST,
			'message' => 'No se ha podido completar la solicitud.'
		];

		// Recoger token
		$token = $req->headers->get('Authorization');

		// comprobar token
		$auth = $jwtAuth->checkToken($token);

		// Si es valido Obtener identity
		if (!$auth || empty($token)) {
			$data['code'] = JsonResponse::HTTP_UNAUTHORIZED;
			$data['message'] = 'Necesita iniciar sesion para realizar esta accion.';

			return new JsonResponse($data, $data['code']);
		}

		// Configurar bundle de paginacion
		$identity = $jwtAuth->checkToken($token, true);

		$em = $this->getDoctrine()->getManager();

		// Consulta para paginar
		$dql = "SELECT v FROM App\Entity\Video v WHERE v.user = {$identity->sub} ORDER BY v.id DESC";

		$query = $em->createQuery($dql);

		// Recoger parametro page de paginacion
		$page = $req->query->getInt('page', 1);
		$items_per_page = 5;

		// invocar paginacion
		$pagination = $paginator->paginate($query, $page, $items_per_page);
		$total = $pagination->getTotalItemCount();

		// devolver respuesta
		$data['status'] = 'ok';
		$data['code'] = JsonResponse::HTTP_OK;
		unset($data['message']);

		$data['totalItems'] = $total;
		$data['page'] = $page;
		$data['pageItems'] = $items_per_page;
		$data['totalPages'] = ceil($total / $items_per_page);
		$data['videos'] = $pagination;
		$data['user'] = $identity->sub;

		return $this->resJson($data);
	}

	public function detail(Request $req, JwtAuth $jwtAuth, $id = null)
	{
		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_NOT_FOUND,
			'message' => 'No se ha podido encontrar en video.'
		];

		// Recoger token
		$token = $req->headers->get('Authorization');

		// comprobar token
		$auth = $jwtAuth->checkToken($token);

		// Si es valido Obtener identity
		if (!$auth || empty($token)) {
			$data['code'] = JsonResponse::HTTP_UNAUTHORIZED;
			$data['message'] = 'Necesita iniciar sesion para realizar esta accion.';

			return new JsonResponse($data, $data['code']);
		}

		// sacar identidad de user
		$identity = $jwtAuth->checkToken($token, true);

		// sacar video en base a id
		$video = $this->getDoctrine()
			->getRepository(Video::class)
			->findOneBy([
				'id' => $id,
				'user' => $identity->sub
			]);

		// comprobar si video pertenece al user
		if ($video && is_object($video)) {
			// devovler respuesta
			$data['status'] = 'ok';
			$data['code'] = JsonResponse::HTTP_OK;
			$data['video'] = $video;
			unset($data['message']);

			return $this->resJson($data);
		}
		return new JsonResponse($data, $data['code']);
	}

	public function delete(Request $req, JwtAuth $jwtAuth, $id = null)
	{
		$data = [
			'status' => 'error',
			'code' => JsonResponse::HTTP_NOT_FOUND,
			'message' => 'No se ha podido encontrar en video.'
		];

		// Recoger token
		$token = $req->headers->get('Authorization');

		// comprobar token
		$auth = $jwtAuth->checkToken($token);

		// Si es valido Obtener identity
		if (!$auth || empty($token)) {
			$data['code'] = JsonResponse::HTTP_UNAUTHORIZED;
			$data['message'] = 'Necesita iniciar sesion para realizar esta accion.';

			return new JsonResponse($data, $data['code']);
		}

		// sacar identidad de user
		$identity = $jwtAuth->checkToken($token, true);
		$em = $this->getDoctrine()->getManager();
		// sacar video
		$video = $this->getDoctrine()
			->getRepository(Video::class)
			->findOneBy([
				'id' => $id,
				'user' => $identity->sub
			]);

		if ($video && is_object($video)) {
			$em->remove($video);
			$em->flush();

			$data['status'] = 'ok';
			$data['code'] = JsonResponse::HTTP_OK;
			$data['video'] = $video;
			unset($data['message']);

			return $this->resJson($data);
		}

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
