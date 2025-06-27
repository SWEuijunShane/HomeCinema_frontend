// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';

// interface MovieDetailType {
//   id: number;
//   title: string;
//   overview: string;
//   poster_path: string;
//   release_date: string;
//   genres?: { id: number; name: string }[];
// }

// const MovieDetail = () => {
//   const { id } = useParams();
//   const [movie, setMovie] = useState<MovieDetailType | null>(null);

//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tmdb/movie/${id}`)
//         .then((res) => setMovie(res.data))
//         .catch((err) => console.error('영화 디테일 호출 실패:', err));
//     }
//   }, [id]);

//   if (!movie) return <div className="p-6">로딩 중...</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
//       <img
//         src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//         alt={movie.title}
//         className="w-64 rounded mb-4"
//       />
//       <p className="text-sm text-gray-500 mb-2">개봉일: {movie.release_date}</p>
//       <p className="mb-4">{movie.overview}</p>
//       {movie.genres && (
//         <p>
//           <strong>장르:</strong> {movie.genres.map((g) => g.name).join(', ')}
//         </p>
//       )}
//     </div>
//   );
// };

// export default MovieDetail;
