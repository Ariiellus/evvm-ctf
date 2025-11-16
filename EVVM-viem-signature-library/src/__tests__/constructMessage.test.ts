/**
 * Test utilities for message construction
 */

import {
  buildMessageSignedForPay,
  buildMessageSignedForDispersePay,
  buildMessageSignedForPublicStaking,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStake,
  buildMessageSignedForPreRegistrationUsername,
  buildMessageSignedForRegistrationUsername,
} from '../utils/constructMessage';

describe('Message Construction', () => {
  describe('EVVM Messages', () => {
    test('buildMessageSignedForPay should construct correct message', () => {
      const message = buildMessageSignedForPay(
        1n,
        '0x742d35cc6634c0532925a3b8d138068fd4c1b7a1',
        '0x0000000000000000000000000000000000000000' as `0x${string}`,
        1000000000000000000n,
        50000000000000000n,
        1n,
        true,
        '0x742d35cc6634c0532925a3b8d138068fd4c1b7a1' as `0x${string}`
      );

      expect(message).toBe(
        'ef83c1d6,1,0x742d35cc6634c0532925a3b8d138068fd4c1b7a1,0x0000000000000000000000000000000000000000,1000000000000000000,50000000000000000,1,true,0x742d35cc6634c0532925a3b8d138068fd4c1b7a1'
      );
    });

    test('buildMessageSignedForDispersePay should construct correct message', () => {
      const message = buildMessageSignedForDispersePay(
        1n,
        '0xabcdef1234567890abcdef1234567890abcdef12',
        '0x0000000000000000000000000000000000000000' as `0x${string}`,
        2000000000000000000n,
        100000000000000000n,
        2n,
        false,
        '0x742d35cc6634c0532925a3b8d138068fd4c1b7a1' as `0x${string}`
      );

      expect(message).toBe(
        'ef83c1d6,1,0xabcdef1234567890abcdef1234567890abcdef12,0x0000000000000000000000000000000000000000,2000000000000000000,100000000000000000,2,false,0x742d35cc6634c0532925a3b8d138068fd4c1b7a1'
      );
    });
  });

  describe('Staking Messages', () => {
    test('buildMessageSignedForPublicStaking should construct correct message', () => {
      const message = buildMessageSignedForPublicStaking(
        1n,
        true,
        1000000000000000000n,
        1n
      );

      expect(message).toBe('e91b3f94,1,true,1000000000000000000,1');
    });

    test('buildMessageSignedForPresaleStaking should construct correct message', () => {
      const message = buildMessageSignedForPresaleStaking(
        1n,
        true,
        5083000000000000000000n,
        1n
      );

      expect(message).toBe('e91b3f94,1,true,5083000000000000000000,1');
    });

    test('buildMessageSignedForPublicServiceStake should construct correct message', () => {
      const message = buildMessageSignedForPublicServiceStake(
        1n,
        '0x742d35cc6634c0532925a3b8d138068fd4c1b7a1',
        true,
        1000000000000000000n,
        1n
      );

      expect(message).toBe('e91b3f94,1,0x742d35cc6634c0532925a3b8d138068fd4c1b7a1,true,1000000000000000000,1');
    });
  });

  describe('NameService Messages', () => {
    test('buildMessageSignedForPreRegistrationUsername should construct correct message', () => {
      const message = buildMessageSignedForPreRegistrationUsername(
        1n,
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        1n
      );

      expect(message).toBe('e91b3f94,1,0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890,1');
    });

    test('buildMessageSignedForRegistrationUsername should construct correct message', () => {
      const message = buildMessageSignedForRegistrationUsername(
        1n,
        'testuser',
        12345n,
        1n
      );

      expect(message).toBe('e91b3f94,1,testuser,12345,1');
    });
  });
});