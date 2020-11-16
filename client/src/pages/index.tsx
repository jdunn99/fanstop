import React from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { withApollo } from '../util/withApollo';
import { Navbar } from '../components/Navbar';

function Home() {
	const router = useRouter();
	const { pid } = router.query;

	return (
		<div className={styles.container}>
			<Navbar />
			<p>Poggers</p>
		</div>
	);
}

export default withApollo(Home);
