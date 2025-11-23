import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/page";
import Providers from "./providers";
import { Bounce, ToastContainer } from "react-toastify";
import "sweetalert2/dist/sweetalert2.js";
import "katex/dist/katex.min.css";
import "mathlive/static.css";
import "./globals.css";
import Notification from "@/components/notification/notification";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Học tập",
  description: "Nền tảng học tập hiện đại cho giáo viên và học sinh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="remove-browser-extension-attributes-inline"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes immediately - chạy trước khi React hydrate
              (function() {
                const unwantedAttributes = ['bis_skin_checked', 'data-lastpass-icon-root', 'data-lastpass-root'];
                function removeAttrs() {
                  try {
                    if (document.body) {
                      unwantedAttributes.forEach(attr => {
                        document.querySelectorAll('[' + attr + ']').forEach(el => {
                          if (el.removeAttribute) el.removeAttribute(attr);
                        });
                      });
                    }
                  } catch(e) {}
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeAttrs);
                } else {
                  removeAttrs();
                }
              })();
            `,
          }}
        />
        <Script
          id="remove-browser-extension-attributes"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Remove attributes từ browser extensions - chạy sớm nhất có thể
              (function() {
                // Danh sách các attributes không mong muốn từ browser extensions
                const unwantedAttributes = ['bis_skin_checked', 'data-lastpass-icon-root', 'data-lastpass-root'];
                
                function removeExtensionAttributes() {
                  try {
                    unwantedAttributes.forEach(attr => {
                      const allElements = document.querySelectorAll('[' + attr + ']');
                      allElements.forEach(el => {
                        if (el.removeAttribute) {
                          el.removeAttribute(attr);
                        }
                      });
                    });
                  } catch(e) {
                    // Ignore errors
                  }
                }
                
                // Chạy ngay lập tức nếu DOM đã sẵn sàng
                if (document.body) {
                  removeExtensionAttributes();
                }
                
                // Chạy khi DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeExtensionAttributes, { once: true });
                } else {
                  removeExtensionAttributes();
                }
                
                // Chạy sau khi page load
                window.addEventListener('load', removeExtensionAttributes, { once: true });
                
                // Observer để remove attributes mới được thêm vào - chạy sau khi DOM ready
                function setupObserver() {
                  if (!document.body) {
                    setTimeout(setupObserver, 10);
                    return;
                  }
                  
                  try {
                    const observer = new MutationObserver(function(mutations) {
                      mutations.forEach(function(mutation) {
                        // Xử lý nodes mới được thêm vào
                        mutation.addedNodes.forEach(function(node) {
                          if (node.nodeType === 1) {
                            const element = node;
                            unwantedAttributes.forEach(attr => {
                              if (element.hasAttribute && element.hasAttribute(attr)) {
                                element.removeAttribute(attr);
                              }
                            });
                            // Xử lý cả children
                            unwantedAttributes.forEach(attr => {
                              const children = element.querySelectorAll && element.querySelectorAll('[' + attr + ']');
                              if (children) {
                                children.forEach(child => {
                                  if (child.removeAttribute) {
                                    child.removeAttribute(attr);
                                  }
                                });
                              }
                            });
                          }
                        });
                        // Xử lý attributes bị thay đổi
                        if (mutation.type === 'attributes') {
                          unwantedAttributes.forEach(attr => {
                            if (mutation.attributeName === attr) {
                              if (mutation.target.removeAttribute) {
                                mutation.target.removeAttribute(attr);
                              }
                            }
                          });
                        }
                      });
                    });
                    
                    observer.observe(document.body, {
                      childList: true,
                      subtree: true,
                      attributes: true,
                      attributeFilter: unwantedAttributes
                    });
                  } catch(e) {
                    // Ignore errors
                  }
                }
                
                // Setup observer sau khi DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', setupObserver, { once: true });
                } else {
                  setupObserver();
                }
              })();
            `,
          }}
        />
        <Providers>
          {" "}
          {/* 👉 Bọc ở đây */}
          {children}
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <Notification />
          
        </Providers>
      </body>
    </html>
  );
}
