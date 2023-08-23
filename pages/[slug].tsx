import { GetServerSidePropsContext } from "next";

export default function Test({ query }: GetServerSidePropsContext) {
    return <p>{JSON.stringify(query)}</p>;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
    return {
        props: {
            query,
        },
    };
}
