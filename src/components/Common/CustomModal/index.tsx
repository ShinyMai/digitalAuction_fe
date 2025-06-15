import React from "react";
import styles from "./styles.module.scss";
import "./style.scss";
import { ModalWrapper } from "./styled";
import cn from "../../../libs/classnames";

interface CustomModalProps {
  children: React.ReactNode;
  className?: string;
  tilteStart?: boolean;
  hiddenScroll?: boolean;
  [key: string]: unknown;
}

const CustomModal: React.FC<CustomModalProps> = ({
  children,
  className = "",
  tilteStart = true,
  hiddenScroll = false,
  ...restProps
}) => {
  return (
    <ModalWrapper
      width={1024}
      {...restProps}
      className={cn(className, {
        [styles.titleFlexStart]: tilteStart,
      })}
      hiddenScroll={hiddenScroll}
      maskTransitionName=""
    >
      {children}
    </ModalWrapper>
  );
};

export default CustomModal;
