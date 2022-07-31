import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../../AtcPortal/dealers/outsideClick';

const MenuOptions = ({ optionsNode, mainOptionsCSS, menuListCSS }) => {
    const ref = useRef(null);
    useOnClickOutside(ref, () => setMenuShow(false));
    const [menuShow, setMenuShow] = useState(false);
    return (
        <>
            <div className={`col-md-2 menu-options-main ${mainOptionsCSS}`}>
                <div className="dots" onClick={() => setMenuShow(!menuShow)}>
                    ...
                    {menuShow && (
                        <div className={`menu-list ${menuListCSS}`} ref={ref}>
                            <div className="pointer"></div>
                            {optionsNode}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MenuOptions;
