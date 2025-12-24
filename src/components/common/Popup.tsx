import styles from './Popup.module.scss';

interface PopupProps {
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ children }) => {
    return (
        <div className={styles.bg}>
            <div className={styles.modal}>{children}</div>
        </div>
    );
};

export default Popup;
