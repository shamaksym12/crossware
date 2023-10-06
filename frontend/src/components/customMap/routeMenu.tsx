import React from 'react';
import { useTranslation } from "react-i18next";

interface PopoverMenuProps {
    displayRoute: () => void;
    hideRoute: () => void;
}

const RouteMenu: React.FC<PopoverMenuProps> = ({ displayRoute, hideRoute }) => {

    const { t } = useTranslation();

    const handleRightClick = (event: React.MouseEvent<HTMLUListElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <>
            <div className="triUp"></div>
            <ul className="popover-menu" onContextMenu={handleRightClick}>
                <li onMouseOver={() => displayRoute()}>{t("routeboard.showRoute")}</li>
                <li onMouseOver={() => hideRoute()}>{t("routeboard.hideRoute")}</li>
            </ul>
        </>
    );
};

export default RouteMenu;
