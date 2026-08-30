/**
 * Chart Export Utility
 * Trích xuất các thẻ đồ thị (Recharts SVG/HTML container) ra tệp ảnh PNG chất lượng cao (Scale 2x retina).
 */
import html2canvas from 'html2canvas';

export async function exportChartAsPng(elementId: string, fileName = 'data-chart.png'): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for export.`);
    return false;
  }

  try {
    const isDark = document.documentElement.classList.contains('dark');
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution (Retina quality)
      useCORS: true,
      backgroundColor: isDark ? '#0f172a' : '#fafcfd',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
    return false;
  }
}
