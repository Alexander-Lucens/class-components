import type { ReactElement, ReactNode } from 'react'
import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[]
}

const AllProviders = ({ children, initialEntries }: { children?: ReactNode; initialEntries?: string[] }) => {
  return (
    <AppProvider>
      <MemoryRouter initialEntries={initialEntries || ['/']}>
        {children}
      </MemoryRouter>
    </AppProvider>
  )
}

const render = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { initialEntries, ...renderOptions } = options
  return rtlRender(ui, {
    wrapper: ({ children }) => <AllProviders initialEntries={initialEntries}>{children}</AllProviders>,
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { render }