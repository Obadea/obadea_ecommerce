'use client'

import React from 'react'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'
import { Button } from '../../Button'
import Image from 'next/image'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()

  return (
    <>
      <nav className={[classes.nav, user === undefined && classes.hide].filter(Boolean).join(' ')}>
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="none" />
        })}
        {/* <CartLink /> */}
        {user && <Link href="/account">Account</Link>}
        {!user && (
          <Button
            el="link"
            href="/login"
            label="login"
            appearance="primary"
            onClick={() => {
              window.location.href = '/login'
            }}
          />
        )}

        {user && <CartLink />}
      </nav>
      <div className={classes.rightNav}>
        {user && <CartLink />}
        {!user && (
          <Button
            el="link"
            href="/login"
            label="login"
            appearance="primary"
            onClick={() => {
              window.location.href = '/login'
            }}
          />
        )}
        <div className={classes.iconSvg}>
          <Image
            className={classes.icon}
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
          />
          <nav
            className={[classes.iconMenuItem, user === undefined && classes.hide]
              .filter(Boolean)
              .join(' ')}
          >
            {navItems.map(({ link }, i) => {
              return (
                <>
                  <Link
                    key={i}
                    className={classes.mapedNavitem}
                    href={`/${link.reference.value.slug}`}
                  >
                    <CMSLink key={i} {...link} appearance="none" />{' '}
                    <img
                      src="/assets/icons/arrow-right.svg"
                      alt="arrow right"
                      width={20}
                      height={20}
                    />
                    <br />
                  </Link>
                  <hr />
                </>
              )
            })}
            {/* <CartLink /> */}
            {user && (
              <Link href="/account" className={classes.accountlink}>
                <p>Account</p>{' '}
                <img src="/assets/icons/arrow-right.svg" alt="arrow right" width={20} height={20} />{' '}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
