import styled from "styled-components";
import { Modal } from "antd";

interface ModalWrapperProps {
  hiddenScroll?: boolean;
  isError?: boolean;
}

export const ModalWrapper = styled(Modal)<ModalWrapperProps>`
  .ant-modal .ant-modal-header {
    background: ${(props) => (props.isError ? "red" : "var(--primary-gradient)")};
  }

  .ant-modal-header {
    padding: 0 !important;
  }

  .ant-modal-title {
    background: var(--primary-gradient) !important;
    font-weight: bold;
    font-size: 1.6em !important;
    color: white !important;
    padding: 10px 20px !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .ant-modal-content {
    padding: 0;
  }

  .ant-modal-body {
    flex: auto;
    overflow: ${(props) => (props.hiddenScroll ? "hidden" : "hidden auto")};
    padding: 20px;
  }

  .ant-image.css-dev-only-do-not-override-1mqg3i0 {
    width: 100%;
  }
`;
