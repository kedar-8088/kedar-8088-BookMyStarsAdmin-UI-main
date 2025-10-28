// material-ui

import LogoImg from '../assets/images/BookMyStarsLogo.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO IMAGE ||============================== //

const Logo = ({ width = 90, height = 60 }) => {
    const finalHeight = typeof height === 'number' ? height : width;

    return <img src={LogoImg} alt="BookMyStars" width={width} height={finalHeight} />;
};

export default Logo;
