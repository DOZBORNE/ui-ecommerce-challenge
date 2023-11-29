import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Pagination from "@/components/Pagination/Pagination";
import { getPaginationControls } from "@/helpers";
import { Product } from "@/types";

type HomeProps = {
  productData: ProductData;
  paginationControls: { pageStart: number; pageEnd: number };
  page: number;
};

type ProductData = {
  limit: number;
  products: Product[];
  skip: number;
  total: number;
};

export default function Home({
  productData: { products, total },
  paginationControls,
  page,
}: HomeProps) {
  // useEffect(() => {
  //   fetch("https://dummyjson.com/products?limit=10")
  //     .then((response) => response.json())
  //     .then((data: ProductData) => {
  //       setProducts(data.products);
  //       setPaginationData(data);
  //     });
  //
  //   // TODO: re-run on every render
  // }, []);

  return (
    <>
      <Head>
        <title>Products.com</title>
        <meta name="description" content="The site to shop for products" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className={styles.display}>
          <div>
            <h1>Shop Products</h1>
          </div>
          <div className={styles.typeAheadContainer}>
            <pre>🎯🎯🎯 Insert Typeahead here</pre>
          </div>
          <div className={styles.productList}>
            {products?.length > 0 &&
              products.map((data) => (
                <Link
                  href={`/products/${data.id}`}
                  className={styles.card}
                  key={data.id}
                >
                  <div className={styles.cardImage}>
                    <Image
                      src={data.thumbnail}
                      alt={data.description}
                      loading="eager"
                      fill
                    />
                  </div>

                  <h5>{data.title}</h5>
                  <p>{data.description}</p>
                </Link>
              ))}
          </div>
          <Pagination
            page={page}
            recordTotal={total}
            recordStart={paginationControls.pageStart}
            recordEnd={paginationControls.pageEnd}
          />
        </section>
      </main>
    </>
  );
}

const calculateSkip = (limit: number, currentPage: number) => {
  return limit * (currentPage - 1);
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { query } = context;
  const page = Number(query["page"]) || 1;

  const response = await fetch(
    `https://dummyjson.com/products?limit=10&skip=${calculateSkip(10, page)}`,
  );

  const productData = (await response.json()) satisfies ProductData;

  const paginationControls = getPaginationControls(10, page, productData.total);

  return {
    props: {
      productData,
      paginationControls,
      page,
    },
  };
};
