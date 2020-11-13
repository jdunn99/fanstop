import '../styles/globals.css';
import { ChakraProvider, theme } from '@chakra-ui/core';

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
