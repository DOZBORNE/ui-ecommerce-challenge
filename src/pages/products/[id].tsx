import { GetServerSidePropsContext } from "next";
import styles from "./[id].module.css";
import { Product } from "@/types";
import Image from "next/image";
import { useRouter } from "next/router";

type ProductDetailProps = {
  product?: Product;
};
export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  if (!product)
    return (
      <div>Oops! It looks like we had some trouble rendering this data.</div>
    );

  return (
    <div>
      <button onClick={() => router.back()}>
        <span>Go Back</span>
      </button>
      <div className={styles.card}>
        <div className={styles.image}>
          <Image src={product.thumbnail} alt={product.description} fill />
        </div>
        <div className={styles.detail}>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <h5>${product.price.toFixed(2)}</h5>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { params } = context;
  if (!Number(params?.id)) return { props: {} };

  const response = await fetch(`https://dummyjson.com/products/${params?.id}`);
  const product = await response.json();

  return { props: { product } };
};
