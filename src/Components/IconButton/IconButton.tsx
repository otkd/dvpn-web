/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { IconButton as MIB } from '@material-ui/core'

interface Props {
  children?: any
  onClick?: () => void
}

const IconButton = ({ children, onClick }: Props) => {
  return (
    <div>
      <MIB edge={false} onClick={onClick}>
        {children}
      </MIB>
    </div>
  )
}

export default IconButton
