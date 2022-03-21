import React from 'react'
import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'
import styles from './index.module.css'
function FilterFooter({
  cancelText = '取消',
  okText = '确定',
  onCancel,
  onOk,
  className,
  style
}) {
  return (
    <Flex style={style} className={[styles.root, className || ''].join(' ')}>
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={onCancel}
      >
        {cancelText}
      </span>
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </Flex>
  )
}
FilterFooter.propTypes = {
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
}
export default FilterFooter