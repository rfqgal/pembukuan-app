<?php

namespace App\Http\Response;

use Illuminate\Support\Facades\Response;

class APIResponse
{

    /**
     * Success response API
     *
     * @param string $message
     * @param array|object $data
     * @param int $httpCode
     * @return \Illuminate\Http\JsonResponse
     */
    public static function success(string $message, $data = null, int $httpCode = 200)
    {
        return Response::json([
            'status_code' => $httpCode,
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $httpCode);
    }

    /**
     * Error response API
     *
     * @param string $message
     * @param array $data
     * @param int $httpCode
     * @return \Illuminate\Http\JsonResponse
     */
    public static function error(string $message, $data = null, int $httpCode = 500)
    {
        return Response::json([
            'status_code' => $httpCode,
            'success' => false,
            'message' => $message,
            'data' => $data,
        ], $httpCode);
    }
}