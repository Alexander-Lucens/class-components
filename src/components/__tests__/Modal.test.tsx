import { render, screen, fireEvent } from '../../test-utils'
import { describe, expect, it, vi } from 'vitest'
import Modal from '../Modal/Modal'

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen title="Test Modal" onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} title="Test Modal" onClose={vi.fn()}>
        <p>Hidden content</p>
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <button>Focus me</button>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when dialog content is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('moves focus to first focusable element on open', () => {
    render(
      <Modal isOpen title="Test Modal" onClose={vi.fn()}>
        <button data-testid="first-btn">First</button>
        <button>Second</button>
      </Modal>
    )
    expect(document.activeElement).toBe(screen.getByTestId('first-btn'))
  })

  it('displays the title', () => {
    render(
      <Modal isOpen title="My Form Title" onClose={vi.fn()}>
        <span>body</span>
      </Modal>
    )
    expect(screen.getByText('My Form Title')).toBeInTheDocument()
  })
})