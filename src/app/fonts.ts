import { Archivo } from 'next/font/google';

// uma família variável com eixo de largura: condensada nos títulos, expandida nas legendas
export const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo' });
