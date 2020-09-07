/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { FC, useState } from 'react';
import {
    DECIMAL_PART_V3,
    PaymentMethod,
    pricePerGiB,
    pricePerMinute,
    ServiceInfo,
    ServiceStatus,
} from 'mysterium-vpn-js';
import { CircularProgress, Switch } from '@material-ui/core';
import { tequilapi } from 'mysterium-vpn-js/lib/tequilapi-client-factory';

import { ServiceType } from '../../../../../commons';
import { displayMoneyMyst, displayMyst } from '../../../../../commons/money.utils';
import { DefaultSwitch } from '../../../../../Components/DefaultSwitch';
import { ReactComponent as WireGuardIcon } from '../../../../../assets/images/wg-icon.svg';
import { ReactComponent as OpenVpnIcon } from '../../../../../assets/images/ovpn-icon.svg';

const { RUNNING } = ServiceStatus;

interface Props {
    identityRef: string;
    serviceType: ServiceType;
    serviceInfo?: ServiceInfo;
}

const icons = {
    [ServiceType.OPENVPN]: <OpenVpnIcon />,
    [ServiceType.WIREGUARD]: <WireGuardIcon />,
};

const toMystMinute = (pm?: PaymentMethod): string => {
    return pm
        ? displayMoneyMyst(pricePerMinute(pm), {
              decimalPart: DECIMAL_PART_V3,
          })
        : displayMyst(0, { decimalPart: DECIMAL_PART_V3 });
};

const toMystGb = (pm?: PaymentMethod): string => {
    return pm
        ? displayMoneyMyst(pricePerGiB(pm), {
              decimalPart: DECIMAL_PART_V3,
          })
        : displayMyst(0, { decimalPart: DECIMAL_PART_V3 });
};

const ServiceCard: FC<Props> = ({ serviceType, serviceInfo, identityRef }) => {
    const [isTurnOnWorking, setTurnOnWorking] = useState<boolean>(false);
    const { status, proposal, id } = { ...serviceInfo };

    const startService = (serviceType: string) => {
        setTurnOnWorking(true);
        tequilapi
            .serviceStart({
                providerId: identityRef,
                type: serviceType,
            })
            .finally(() => setTurnOnWorking(false));
    };

    const stopService = (serviceId: string) => {
        setTurnOnWorking(true);
        tequilapi.serviceStop(serviceId).finally(() => setTurnOnWorking(false));
    };

    return (
        <div className="services-blocks-row--block">
            <div className="header-row">
                <div className="logo-block">
                    {icons[serviceType]}
                    <div className={status === RUNNING ? 'status-dot on' : 'status-dot off'} />
                </div>
                <div className="name-block">
                    <p className="name">{serviceType}</p>
                    <p className="type">VPN</p>
                </div>
            </div>
            <div className="stats-row">
                <div className="service-stat text">
                    <div className="title">Price per minute</div>
                    <div className="text">{toMystMinute(proposal?.paymentMethod)}</div>
                </div>
                <div className="service-stat text">
                    <div className="title">Price per GB</div>
                    <div className="text">{toMystGb(proposal?.paymentMethod)}</div>
                </div>
                <div className="service-stat switch">
                    <div className="title">Whitelisted</div>
                    <DefaultSwitch tunedOn={false} handleChange={() => {}} type="normal" />
                </div>
                <div className="service-stat switch">
                    <div className="title">Turned on</div>
                    {isTurnOnWorking ? (
                        <CircularProgress />
                    ) : (
                        <Switch
                            checked={!!serviceInfo}
                            onChange={() => {
                                if (!id) {
                                    startService(serviceType.toLowerCase());
                                } else {
                                    stopService(id);
                                }
                            }}
                            className={'default-switch '}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;