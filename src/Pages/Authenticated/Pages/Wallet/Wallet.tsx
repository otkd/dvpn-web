/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import Header from '../../Components/Header';
import { ReactComponent as Logo } from '../../../../assets/images/authenticated/pages/wallet/logo.svg';

const Wallet = () => {
    return (
        <div className="wallet wrapper">
            <div className="wallet--content">
                <Header logo={Logo} name="Wallet" />
            </div>
        </div>
    );
};

export default Wallet;