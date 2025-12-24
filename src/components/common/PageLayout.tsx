import styles from './PageLayout.module.scss';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

export default PageLayout;
