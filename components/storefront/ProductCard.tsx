import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  inStock = true,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">En rupture de stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {category && (
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
            {category}
          </p>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-xl font-bold text-red-600">
          ${price.toFixed(2)} CAD
        </p>
      </div>
    </Link>
  );
}
