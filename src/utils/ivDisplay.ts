
export function getIVBarPercentage(averageIV: number): number {
    return Math.trunc((averageIV / 31) * 100);
}

export function getIVGradeClass(iv: number): string {
    if (iv > 25) return 'iv-excellent';  // Verde (> 25)
    if (iv >= 15) return 'iv-good';      // Amarillo (15 - 25)
    if (iv >= 5) return 'iv-average';    // Naranja (5 - 14)
    return 'iv-bad';                     // Rojo (< 5)
};