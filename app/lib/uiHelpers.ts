import { useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

/**
 * UI & Navigation Helpers
 * Mô-đun tiện ích dùng chung cho điều hướng cuộn mượt, căn giữa tab thanh ngang và sao chép deep link.
 */

/**
 * Tìm container cuộn phù hợp nhất cho một phần tử (scrollParent hoặc window)
 */
export function getScrollParent(element: HTMLElement): HTMLElement | null {
  let p: HTMLElement | null = element.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const style = window.getComputedStyle(p);
    if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && p.scrollHeight > p.clientHeight) {
      return p;
    }
    p = p.parentElement;
  }
  return null;
}

/**
 * Cuộn mượt trang đến một section cụ thể với việc bù trừ chiều cao của sticky navbar
 * @param targetId ID của thẻ section cần cuộn tới
 * @param extraOffset Khoảng đệm bổ sung dưới navbar (mặc định 16px)
 */
export function scrollToSection(targetId: string, extraOffset = 16): boolean {
  if (typeof window === 'undefined') return false;

  const el = document.getElementById(targetId);
  if (!el) return false;

  const scrollParent = getScrollParent(el);
  const navEl = document.querySelector('nav.sticky') as HTMLElement | null;
  const navOffset = (navEl ? navEl.offsetHeight : 125) + extraOffset;

  if (scrollParent) {
    const cRect = scrollParent.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    const targetScrollTop = scrollParent.scrollTop + (tRect.top - cRect.top) - navOffset;
    scrollParent.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth',
    });
  } else {
    const tRect = el.getBoundingClientRect();
    const targetY = window.scrollY + tRect.top - navOffset;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  }

  return true;
}

/**
 * Căn giữa một nút tab trong container cuộn ngang (overflow-x-auto)
 * Chú ý: Chỉ thay đổi scrollLeft của container, hoàn toàn không chạm vào window.scrollY
 * @param container Element của thanh trượt ngang
 * @param btnId ID của nút tab cần căn giữa
 */
export function centerTabInContainer(container: HTMLElement | null, btnId: string): void {
  if (!container || typeof window === 'undefined') return;

  const btn = document.getElementById(btnId);
  if (!btn) return;

  const containerWidth = container.clientWidth;
  const btnLeft = btn.offsetLeft;
  const btnWidth = btn.offsetWidth;
  const targetScrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);

  container.scrollTo({
    left: Math.max(0, targetScrollLeft),
    behavior: 'smooth',
  });
}

/**
 * Sao chép liên kết deep link đến section và hiển thị thông báo Toast
 */
export function copyDeepLink(
  sectionId: string,
  title: string,
  showToast: (_message: string, _type?: 'success' | 'error' | 'info') => void,
  isEn = false
): void {
  if (typeof window === 'undefined') return;

  const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast(
      isEn ? `Copied link to ${title}!` : `Đã sao chép liên kết mục ${title}!`,
      'success'
    );
  }).catch(() => {
    showToast(
      isEn ? 'Failed to copy link.' : 'Không thể sao chép liên kết.',
      'error'
    );
  });
}

/**
 * Hook tiện ích dùng chung cho các Case Study
 * Tự động kết nối ToastContext và cung cấp copyDeepLink cùng exportChart
 */
export function useCaseStudyActions(isEn: boolean) {
  const { showToast } = useToast();

  const handleCopyDeepLink = useCallback((sectionId: string, title: string) => {
    copyDeepLink(sectionId, title, showToast, isEn);
  }, [showToast, isEn]);

  const handleExportChart = useCallback((elementId: string, name: string) => {
    exportChartWithToast(elementId, name, showToast, isEn);
  }, [showToast, isEn]);

  return {
    showToast,
    copyDeepLink: handleCopyDeepLink,
    handleExportChart,
  };
}

/**
 * Chart Export Utility
 * Trích xuất các thẻ đồ thị (Recharts SVG/HTML container) ra tệp ảnh PNG chất lượng cao.
 */
export async function exportChartAsPng(elementId: string, fileName = 'data-chart.png'): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for export.`);
    return false;
  }

  try {
    const html2canvas = (await import('html2canvas')).default;
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

/**
 * Trích xuất biểu đồ ra ảnh PNG kèm thông báo Toast song ngữ tự động
 */
export async function exportChartWithToast(
  elementId: string,
  name: string,
  showToast: (_msg: string, _type?: 'success' | 'error' | 'info') => void,
  isEn = false
): Promise<boolean> {
  const ok = await exportChartAsPng(elementId, `${name}.png`);
  if (ok) {
    showToast(isEn ? `Exported ${name} as PNG!` : `Đã tải ảnh biểu đồ ${name}!`, 'success');
  } else {
    showToast(isEn ? 'Failed to export chart image.' : 'Không thể xuất ảnh biểu đồ.', 'error');
  }
  return ok;
}

