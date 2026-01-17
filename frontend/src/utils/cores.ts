// Mapeamento de cores em português para hexadecimal
export const coresPortugues: Record<string, string> = {
  // Cores básicas
  'preto': '#000000',
  'branco': '#FFFFFF',
  'cinza': '#808080',
  'cinzento': '#808080',
  'vermelho': '#FF0000',
  'verde': '#00FF00',
  'azul': '#0000FF',
  'amarelo': '#FFFF00',
  'laranja': '#FFA500',
  'roxo': '#800080',
  'rosa': '#FFC0CB',
  'marrom': '#A52A2A',
  'castanho': '#A52A2A',
  
  // Tons de vermelho
  'vermelho claro': '#FF6B6B',
  'vermelho escuro': '#8B0000',
  'coral': '#FF7F50',
  'carmim': '#DC143C',
  'bordô': '#800020',
  'vinho': '#722F37',
  
  // Tons de azul
  'azul claro': '#ADD8E6',
  'azul escuro': '#00008B',
  'azul marinho': '#000080',
  'azul celeste': '#87CEEB',
  'turquesa': '#40E0D0',
  'ciano': '#00FFFF',
  'água': '#00FFFF',
  
  // Tons de verde
  'verde claro': '#90EE90',
  'verde escuro': '#006400',
  'verde limão': '#32CD32',
  'verde oliva': '#808000',
  'verde menta': '#98FF98',
  'esmeralda': '#50C878',
  
  // Tons de amarelo
  'amarelo claro': '#FFFFE0',
  'amarelo ouro': '#FFD700',
  'dourado': '#FFD700',
  'bege': '#F5F5DC',
  'creme': '#FFFDD0',
  
  // Tons de roxo/violeta
  'roxo claro': '#DDA0DD',
  'roxo escuro': '#4B0082',
  'violeta': '#EE82EE',
  'lilás': '#C8A2C8',
  'púrpura': '#800080',
  'magenta': '#FF00FF',
  'lavanda': '#E6E6FA',
  
  // Tons de laranja
  'laranja claro': '#FFB347',
  'laranja escuro': '#FF8C00',
  'pêssego': '#FFDAB9',
  'salmão': '#FA8072',
  
  // Tons de rosa
  'rosa claro': '#FFB6C1',
  'rosa escuro': '#FF1493',
  'rosa pink': '#FF69B4',
  'pink': '#FF69B4',
  'fúcsia': '#FF00FF',
  
  // Tons de marrom
  'marrom claro': '#D2691E',
  'marrom escuro': '#654321',
  'chocolate': '#D2691E',
  'sépia': '#704214',
  'terracota': '#E2725B',
  
  // Tons de cinza
  'cinza claro': '#D3D3D3',
  'cinza escuro': '#A9A9A9',
  'prata': '#C0C0C0',
  'chumbo': '#71706E',
};

/**
 * Converte uma cor em português ou hexadecimal para código hex válido
 */
export function converterCor(entrada: string): string {
  const entradaLimpa = entrada.trim().toLowerCase();
  
  // Se já é um código hex válido, retorna
  if (/^#[0-9A-Fa-f]{6}$/.test(entrada)) {
    return entrada;
  }
  
  // Se é hex sem #, adiciona
  if (/^[0-9A-Fa-f]{6}$/.test(entrada)) {
    return `#${entrada}`;
  }
  
  // Busca no mapeamento de cores em português
  const corHex = coresPortugues[entradaLimpa];
  if (corHex) {
    return corHex;
  }
  
  // Retorna a entrada original se não encontrar
  return entrada;
}

/**
 * Valida se uma string é uma cor válida (hex ou nome em português)
 */
export function validarCor(entrada: string): boolean {
  const entradaLimpa = entrada.trim().toLowerCase();
  
  // Verifica se é hex válido
  if (/^#?[0-9A-Fa-f]{6}$/.test(entrada)) {
    return true;
  }
  
  // Verifica se está no mapeamento
  return entradaLimpa in coresPortugues;
}
