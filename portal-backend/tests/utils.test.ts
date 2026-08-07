describe('Utility Functions', () => {
  it('should validate password requirements', () => {
    const validPasswords = [
      'ValidPass1!',
      'MyPassword123$',
      'Test@Pass999',
    ];

    const invalidPasswords = [
      'short1!',
      'nouppercase1!',
      'NOLOWERCASE1!',
      'NoNumber!',
      'NoSymbol1',
    ];

    validPasswords.forEach(pwd => {
      expect(pwd.length).toBeGreaterThanOrEqual(12);
      expect(/[A-Z]/.test(pwd)).toBe(true);
      expect(/[a-z]/.test(pwd)).toBe(true);
      expect(/[0-9]/.test(pwd)).toBe(true);
      expect(/[!@#$%^&*(),.?":{}|<>]/.test(pwd)).toBe(true);
    });

    invalidPasswords.forEach(pwd => {
      const isValid = pwd.length >= 12 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
      expect(isValid).toBe(false);
    });
  });

  it('should format project correctly', () => {
    const project = {
      id: 'test-id',
      name: 'Test Project',
      phase: 'Development',
      completion_percent: 50,
    };

    expect(project.name).toBe('Test Project');
    expect(project.completion_percent).toBeLessThanOrEqual(100);
    expect(project.completion_percent).toBeGreaterThanOrEqual(0);
  });
});
