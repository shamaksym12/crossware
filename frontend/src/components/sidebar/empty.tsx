import Container from "components/Container";
import { useTranslation } from "react-i18next";

const EmptyTree = () => {
    
    const { t } = useTranslation();

    return (
        <Container className="emptyTreeContainer">
            <h6>{t("empty.text1")}<br />{t("empty.text2")}</h6>
        </Container>
    );
};

export default EmptyTree;
