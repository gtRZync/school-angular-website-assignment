<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class CartController extends Controller
{
    /**
     * Get all cart items for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            $cartItems = CartItem::where('user_id', $user->id)
                ->with('product')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product' => $item->product,
                        'quantity' => $item->quantity,
                    ];
                });

            return response()->json($cartItems, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * Add item to cart
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            $cartItem = CartItem::where('user_id', $user->id)
                ->where('product_id', $request->product_id)
                ->first();

            if ($cartItem) {
                $cartItem->quantity += $request->quantity;
                $cartItem->save();
            } else {
                $cartItem = CartItem::create([
                    'user_id' => $user->id,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                ]);
            }

            $cartItem->load('product');

            return response()->json([
                'message' => 'Item added to cart',
                'item' => [
                    'id' => $cartItem->id,
                    'product' => $cartItem->product,
                    'quantity' => $cartItem->quantity,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * Update cart item quantity
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            $cartItem = CartItem::where('user_id', $user->id)
                ->where('id', $id)
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'message' => 'Cart item not found'
                ], 404);
            }

            if ($request->quantity == 0) {
                $cartItem->delete();
                return response()->json([
                    'message' => 'Item removed from cart'
                ], 200);
            }

            $cartItem->quantity = $request->quantity;
            $cartItem->save();
            $cartItem->load('product');

            return response()->json([
                'message' => 'Cart item updated',
                'item' => [
                    'id' => $cartItem->id,
                    'product' => $cartItem->product,
                    'quantity' => $cartItem->quantity,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * Remove item from cart
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function remove($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            $cartItem = CartItem::where('user_id', $user->id)
                ->where('id', $id)
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'message' => 'Cart item not found'
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'message' => 'Item removed from cart'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * Clear all cart items for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            CartItem::where('user_id', $user->id)->delete();

            return response()->json([
                'message' => 'Cart cleared'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * Get cart total
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function total()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            $total = CartItem::where('user_id', $user->id)
                ->with('product')
                ->get()
                ->sum(function ($item) {
                    return $item->product->price * $item->quantity;
                });

            return response()->json([
                'total' => round($total, 2)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }
}
