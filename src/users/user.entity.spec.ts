import * as faker from 'faker';

const mockOneToMany = jest.fn().mockReturnValue(jest.fn());

jest.mock('typeorm', () => ({
  ...(jest.requireActual('typeorm') as Record<string, 'unknown'>),
  OneToMany: mockOneToMany
}));

describe('User', () => {
  it('should map relations', async () => {
    const { ExpenseCategory } = await import('../expenseCategories/expenseCategory.entity');
    const { User } = await import('./user.entity');

    const mockOneToManyCall = mockOneToMany.mock.calls[0];
    const mockOneToManyFirstCallback = mockOneToManyCall[0];
    const mockOneToManySecondCallback = mockOneToManyCall[1];
    const user = new User({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(16)
    });
    const expenseCategory = new ExpenseCategory({
      userId: faker.datatype.number(100),
      description: faker.lorem.paragraph(),
      revenuePercentage: 30
    });

    expenseCategory.user = user;

    expect(mockOneToManyFirstCallback()).toBe(ExpenseCategory);
    expect(mockOneToManySecondCallback(expenseCategory)).toStrictEqual(expenseCategory.user);
  });
});
