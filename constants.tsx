import React from 'react';
import { PieceType, PieceColor } from './types';

// Enhanced "Merida" Style Chess Pieces
// These offer excellent readability and a classic, professional look.
// White pieces have black strokes. Black pieces have white strokes for contrast.

export const PIECE_PATHS: Record<string, React.JSX.Element> = {
  [`${PieceColor.w}${PieceType.p}`]: (
    <g fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
    </g>
  ),
  [`${PieceColor.w}${PieceType.n}`]: (
    <g fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
      <path d="M24 18c.38 2.32-.46 2.96-2.36 3.25" />
    </g>
  ),
  [`${PieceColor.w}${PieceType.b}`]: (
    <g fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <g fill="#ffffff" strokeLinecap="butt">
        <path d="M9 36c3.39-.97 9.11-.97 12.5 0H9zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2H15s-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinejoin="miter" />
      </g>
    </g>
  ),
  [`${PieceColor.w}${PieceType.r}`]: (
    <g fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt" />
      <path d="M34 14l-3 3H14l-3-3" />
      <path d="M31 17v12.5c1.71 2.89 2.5 3.5 2.5 6.5h-21c0-3 .79-3.61 2.5-6.5V17" strokeLinecap="butt" strokeLinejoin="miter" />
    </g>
  ),
  [`${PieceColor.w}${PieceType.q}`]: (
    <g fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 20a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 20a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11z" strokeLinecap="butt" />
      <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 1 4.5 1 4.5h20s0-2 1-4.5c1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt" />
      <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" />
    </g>
  ),
  [`${PieceColor.w}${PieceType.k}`]: (
    <g fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" />
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#ffffff" strokeLinecap="butt" />
      <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-1-9-1-5 2-8 2-2-2.36-8-2c-3 6 6 10.5 6 10.5v7z" fill="#ffffff" />
      <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
    </g>
  ),
  [`${PieceColor.b}${PieceType.p}`]: (
    <g fill="#262626" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
    </g>
  ),
  [`${PieceColor.b}${PieceType.n}`]: (
    <g fill="#262626" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
      <path d="M24 18c.38 2.32-.46 2.96-2.36 3.25" />
    </g>
  ),
  [`${PieceColor.b}${PieceType.b}`]: (
    <g fill="#262626" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <g fill="#262626" strokeLinecap="butt">
        <path d="M9 36c3.39-.97 9.11-.97 12.5 0H9zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2H15s-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinejoin="miter" />
      </g>
    </g>
  ),
  [`${PieceColor.b}${PieceType.r}`]: (
    <g fill="#262626" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt" />
      <path d="M34 14l-3 3H14l-3-3" />
      <path d="M31 17v12.5c1.71 2.89 2.5 3.5 2.5 6.5h-21c0-3 .79-3.61 2.5-6.5V17" strokeLinecap="butt" strokeLinejoin="miter" />
    </g>
  ),
  [`${PieceColor.b}${PieceType.q}`]: (
    <g fill="#262626" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 20a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 20a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11z" strokeLinecap="butt" />
      <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 1 4.5 1 4.5h20s0-2 1-4.5c1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt" />
      <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" />
    </g>
  ),
  [`${PieceColor.b}${PieceType.k}`]: (
    <g fill="#262626" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" />
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#262626" strokeLinecap="butt" />
      <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-1-9-1-5 2-8 2-2-2.36-8-2c-3 6 6 10.5 6 10.5v7z" fill="#262626" />
      <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
    </g>
  ),
};