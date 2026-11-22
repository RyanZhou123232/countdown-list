import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { daysUntil, formatDate, loadCountdowns, localDateKey, type Countdown } from '@/lib/countdowns';

export default function HomeScreen() {
  const [entries, setEntries] = useState<Countdown[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [today, setToday] = useState(localDateKey);

  useFocusEffect(useCallback(() => {
    let active = true;
    void loadCountdowns().then(
      (result) => {
        if (!active) return;
        setEntries(result);
        setStatus('ready');
      },
      () => {
        if (active) setStatus('error');
      },
    );
    return () => { active = false; };
  }, [retry]));

  useEffect(() => {
    const refreshDate = () => setToday(localDateKey());
    const interval = setInterval(refreshDate, 30_000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshDate();
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>Countdowns</Text>
          <Text style={styles.description}>Keep track of the dates you’re looking forward to.</Text>
        </View>

        {status === 'loading' && <ActivityIndicator color={colors.accent} />}
        {status === 'error' && (
          <View style={styles.empty}>
            <Text accessibilityRole="alert" style={styles.emptyTitle}>Couldn’t load your countdowns.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setStatus('loading');
                setRetry((attempt) => attempt + 1);
              }}
              style={styles.retry}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}
        {status === 'ready' && (
          <FlatList
            style={styles.list}
            data={entries}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={(
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No countdowns yet</Text>
                <Text style={styles.description}>Add a trip, concert, or any date you want to remember.</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const days = daysUntil(item.date, today);
              const unit = Math.abs(days) === 1 ? 'day' : 'days';
              return (
                <View style={styles.card}>
                  <View style={styles.event}>
                    <Text style={styles.eventName}>{item.name}</Text>
                    <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
                  </View>
                  <View style={styles.badge}>
                    {days === 0 ? <Text style={styles.badgeNumber}>Today</Text> : (
                      <>
                        <Text style={styles.badgeNumber}>{Math.abs(days)}</Text>
                        <Text style={styles.badgeLabel}>{unit} {days < 0 ? 'ago' : 'left'}</Text>
                      </>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        {status === 'ready' && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.navigate('/add')}
            style={({ pressed }) => [styles.add, pressed && styles.pressed]}
          >
            <Text style={styles.addText}>Add countdown</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center', padding: 24 },
  heading: { marginBottom: 28, gap: 8 },
  title: { color: colors.ink, fontSize: 38, fontWeight: '800', letterSpacing: -1.5 },
  description: { color: colors.muted, fontSize: 16, lineHeight: 23 },
  list: { flex: 1 },
  empty: { borderColor: colors.line, borderWidth: 1, borderRadius: 20, padding: 22, gap: 7, backgroundColor: colors.surface },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.ink },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.surface },
  event: { flex: 1, gap: 5 },
  eventName: { fontSize: 17, fontWeight: '700', color: colors.ink },
  eventDate: { fontSize: 14, color: colors.muted },
  badge: { minWidth: 74, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, alignItems: 'center', backgroundColor: colors.accentSoft },
  badgeNumber: { fontSize: 17, fontWeight: '800', color: colors.accent, fontVariant: ['tabular-nums'] },
  badgeLabel: { fontSize: 12, fontWeight: '600', color: colors.accent },
  separator: { height: 10 },
  add: { alignItems: 'center', justifyContent: 'center', minHeight: 54, padding: 12, marginTop: 16, borderRadius: 14, backgroundColor: colors.accent },
  addText: { color: colors.surface, fontSize: 17, fontWeight: '700' },
  pressed: { opacity: 0.8 },
  retry: { alignSelf: 'flex-start', paddingVertical: 10 },
  retryText: { color: colors.accent, fontSize: 16, fontWeight: '700' },
});
