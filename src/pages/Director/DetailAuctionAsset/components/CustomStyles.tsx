const CustomStyles = () => {
  return (
    <style>{`
      .custom-descriptions .ant-descriptions-item-label {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        font-weight: 600 !important;
        color: #374151 !important;
      }
      
      .custom-descriptions .ant-descriptions-item-content {
        background: white !important;
      }

      .animate-slide-in-up {
        animation: slideInUp 0.6s ease-out forwards !important;
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      }

      /* Enhanced Ant Design overrides with !important */
      .ant-card {
        border-radius: 16px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        backdrop-filter: blur(16px) !important;
      }

      .ant-descriptions-bordered .ant-descriptions-item-label {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        font-weight: 600 !important;
        color: #374151 !important;
        border-right: 1px solid #e5e7eb !important;
      }

      .ant-descriptions-bordered .ant-descriptions-item-content {
        background: white !important;
        padding: 16px !important;
      }

      .ant-btn {
        border-radius: 8px !important;
        font-weight: 500 !important;
        transition: all 0.3s ease !important;
      }

      .ant-btn:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15) !important;
      }

      .ant-tag {
        border-radius: 6px !important;
        font-weight: 500 !important;
        padding: 4px 8px !important;
        border: none !important;
      }

      .ant-statistic-title {
        font-weight: 600 !important;
        color: #6b7280 !important;
      }

      .ant-statistic-content {
        font-weight: 700 !important;
      }

      .ant-progress-bg {
        border-radius: 10px !important;
      }

      .ant-progress-inner {
        border-radius: 10px !important;
        background: #f3f4f6 !important;
      }

      .ant-badge-count {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        font-weight: 600 !important;
      }

      .ant-tooltip-inner {
        background: rgba(0, 0, 0, 0.8) !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        font-weight: 500 !important;
      }

      .ant-divider-horizontal {
        margin: 24px 0 !important;
        border-top: 1px solid #e5e7eb !important;
      }
    `}</style>
  );
};

export default CustomStyles;
