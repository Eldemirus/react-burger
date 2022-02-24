import React, {ReactElement} from "react";
import styles from './modal.module.css';
import ReactDOM from "react-dom";
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";

const modalRoot = document.getElementById("react-modals") as HTMLElement;


interface ModalOverlayProps {
    onClick: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({onClick}) => {
    return (
        <div className={styles.overlay} onClick={onClick}/>
    )
}

interface ModalProps {
    handleClose: () => void;
    children: ReactElement;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({handleClose, title, children}) => {
    React.useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [handleClose])

    return ReactDOM.createPortal((
            <>
                <ModalOverlay onClick={handleClose}/>
                <div className={styles.modal}>
                    <div className={styles.headerContainer}>
                        <div className={styles.headerContainerTitle}>
                            {title}
                        </div>
                        <div className={styles.headerContainerIcon}>
                            <CloseIcon type="primary" onClick={handleClose}/>
                        </div>
                    </div>
                    {children}
                </div>
            </>
        ),
        modalRoot)
}
export default Modal;