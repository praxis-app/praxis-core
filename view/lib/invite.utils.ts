export const copyInviteLink = async (token: string): Promise<boolean> => {
  const inviteLink = `${window.location.origin}/i/${token}`;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(inviteLink);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // TODO: Avoid using deprecated `document.execCommand` as a fallback
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.warn('Failed to copy invite link to clipboard:', error);
    return false;
  }
};
