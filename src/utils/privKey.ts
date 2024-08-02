export class PrivKey {
  static LEVELS = ['MEMO', 'POSTING', 'ACTIVE', 'OWNER', 'MASTER'];

  static level = (type: string): number => {
    const level = PrivKey.LEVELS.indexOf(type);
    if (level === -1) {
      throw new Error('Invalid type: ' + type);
    }

    return level;
  };
  static atLeast = (
    type: 'MEMO' | 'POSTING' | 'ACTIVE' | 'OWNER' | 'MASTER',
    target: 'MEMO' | 'POSTING' | 'ACTIVE' | 'OWNER' | 'MASTER',
  ): boolean => {
    const roleLevel = PrivKey.level(type);
    const targetLevel = PrivKey.level(target);
    return roleLevel >= targetLevel;
  };
}
