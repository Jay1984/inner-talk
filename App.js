import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  Switch,
} from 'react-native';

const rituals = {
  overwhelmed: { title: 'Come back to centre', subtitle: 'A grounding pause for when everything feels like too much.', accent: '#B7D8CD', icon: '◌' },
  tense: { title: 'Soften the edges', subtitle: 'Release held tension and let your body settle.', accent: '#F2CF9D', icon: '⌁' },
  scattered: { title: 'One thing at a time', subtitle: 'Find your next clear step with a quiet reset.', accent: '#C9C4ED', icon: '✦' },
  tired: { title: 'Rest between moments', subtitle: 'A gentle transition for an overfull day.', accent: '#A9C9E4', icon: '☾' },
  pause: { title: 'A small return', subtitle: 'Nothing to fix. Just five minutes to be here.', accent: '#DDBECD', icon: '○' },
};

const collections = [
  { title: 'Reset now', note: 'For the in-between moments', color: '#B7D8CD', key: 'overwhelmed' },
  { title: 'Wind down', note: 'Settle into your evening', color: '#C9C4ED', key: 'tired' },
  { title: 'Return to focus', note: 'Clear a little space', color: '#F2CF9D', key: 'scattered' },
];

function PrimaryButton({ label, onPress, inverse = false }) {
  return <Pressable onPress={onPress} style={[styles.primaryButton, inverse && styles.primaryButtonInverse]}><Text style={[styles.primaryButtonText, inverse && styles.primaryButtonTextInverse]}>{label}</Text></Pressable>;
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [intent, setIntent] = useState('Reset');
  const [state, setState] = useState('pause');
  const [completed, setCompleted] = useState(3);
  const [lastFeeling, setLastFeeling] = useState(null);
  const [reminders, setReminders] = useState(true);
  const current = useMemo(() => rituals[state], [state]);

  const beginRitual = (key = state) => {
    setState(key);
    setScreen('player');
  };
  const finishRitual = () => setScreen('checkin');
  const completeCheckin = (feeling) => {
    setLastFeeling(feeling);
    setCompleted((value) => value + 1);
    setScreen('home');
  };

  if (screen === 'welcome') return <SafeAreaView style={styles.welcome}><StatusBar barStyle="light-content" />
    <View style={styles.welcomeOrbOne} /><View style={styles.welcomeOrbTwo} />
    <View style={styles.welcomeContent}><Text style={styles.wordmark}>inner talk</Text><View style={styles.welcomeSpacer} />
      <Text style={styles.welcomeTitle}>A small way{`\n`}back to yourself.</Text>
      <Text style={styles.welcomeBody}>Five-minute, body-led rituals for the moments you need to soften, settle, or begin again.</Text>
      <PrimaryButton label="Begin your pause" onPress={() => setScreen('intention')} inverse />
      <Text style={styles.welcomeFootnote}>Not therapy. A gentle space to check in.</Text>
    </View>
  </SafeAreaView>;

  if (screen === 'intention') return <Shell title="Before we begin" onBack={() => setScreen('welcome')}>
    <Text style={styles.largeTitle}>What would feel supportive today?</Text>
    <Text style={styles.body}>This helps us make your first pause feel a little more like yours.</Text>
    <View style={styles.choiceStack}>{['Reset', 'Unwind', 'Focus', 'Sleep better'].map((item) => <Choice key={item} label={item} selected={intent === item} onPress={() => setIntent(item)} />)}</View>
    <View style={styles.bottomAction}><PrimaryButton label="Continue" onPress={() => setScreen('reminder')} /></View>
  </Shell>;

  if (screen === 'reminder') return <Shell title="A gentle return" onBack={() => setScreen('intention')}>
    <View style={styles.ritualGlyph}><Text style={styles.glyphText}>☼</Text></View>
    <Text style={styles.largeTitle}>Would a daily moment help?</Text>
    <Text style={styles.body}>Choose a time you might like to come back to yourself. You can always change this later.</Text>
    <View style={styles.reminderCard}><View><Text style={styles.cardTitle}>Daily pause</Text><Text style={styles.cardNote}>5:30 PM · after work</Text></View><Switch value={reminders} onValueChange={setReminders} trackColor={{ false: '#DBD9D2', true: '#294C45' }} /></View>
    <View style={styles.bottomAction}><PrimaryButton label="Start my first ritual" onPress={() => beginRitual(intent === 'Unwind' ? 'tired' : intent === 'Focus' ? 'scattered' : 'pause')} /></View>
  </Shell>;

  if (screen === 'player') return <SafeAreaView style={[styles.player, { backgroundColor: current.accent }]}><StatusBar barStyle="dark-content" />
    <View style={styles.playerTop}><Pressable onPress={() => setScreen('home')}><Text style={styles.close}>×</Text></Pressable><Text style={styles.playerDuration}>5:00</Text></View>
    <View style={styles.playerMain}><View style={styles.playerCircle}><View style={styles.playerInnerCircle}><Text style={styles.playerIcon}>{current.icon}</Text></View></View>
      <Text style={styles.playerEyebrow}>YOUR FIVE-MINUTE PAUSE</Text><Text style={styles.playerTitle}>{current.title}</Text><Text style={styles.playerBody}>{current.subtitle}</Text>
    </View>
    <View style={styles.playerBottom}><View style={styles.progressTrack}><View style={styles.progressFill} /></View><Text style={styles.playerPrompt}>Let your shoulders drop. There is nowhere else to be.</Text><PrimaryButton label="Complete ritual" onPress={finishRitual} /></View>
  </SafeAreaView>;

  if (screen === 'checkin') return <Shell title="A small noticing" onBack={() => setScreen('player')}>
    <View style={styles.checkinTop}><Text style={styles.checkinSymbol}>✦</Text><Text style={styles.largeTitle}>How do you feel now?</Text><Text style={styles.body}>There is no right answer. Just notice what is here.</Text></View>
    <View style={styles.choiceStack}>{['Calmer', 'Lighter', 'More present', 'About the same', 'Still overwhelmed'].map((item) => <Choice key={item} label={item} onPress={() => completeCheckin(item)} />)}</View>
    <Text style={styles.supportText}>If you feel unsafe or in crisis, please contact local emergency services or Talk Suicide Canada at 1-833-456-4566.</Text>
  </Shell>;

  return <SafeAreaView style={styles.app}><StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.homeScroll} showsVerticalScrollIndicator={false}>
      {screen === 'home' && <Home completed={completed} lastFeeling={lastFeeling} onStart={() => setScreen('state')} onCollection={(key) => beginRitual(key)} />}
      {screen === 'state' && <StatePicker onBack={() => setScreen('home')} onChoose={beginRitual} />}
      {screen === 'explore' && <Explore onCollection={(key) => beginRitual(key)} />}
      {screen === 'progress' && <Progress completed={completed} lastFeeling={lastFeeling} />}
      {screen === 'profile' && <Profile reminders={reminders} setReminders={setReminders} />}
    </ScrollView>
    <Nav active={screen} setScreen={setScreen} />
  </SafeAreaView>;
}

function Shell({ title, onBack, children }) { return <SafeAreaView style={styles.app}><StatusBar barStyle="dark-content" /><View style={styles.shellTop}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.shellTitle}>{title}</Text><View style={styles.backSpace} /></View><View style={styles.screenBody}>{children}</View></SafeAreaView>; }
function Choice({ label, selected, onPress }) { return <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}><Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text><Text style={[styles.choiceArrow, selected && styles.choiceTextSelected]}>›</Text></Pressable>; }
function Home({ completed, lastFeeling, onStart, onCollection }) { return <View><Text style={styles.wordmarkDark}>inner talk</Text><Text style={styles.homeGreeting}>Good evening,</Text><Text style={styles.homeQuestion}>What do you need{`\n`}right now?</Text><Pressable onPress={onStart} style={styles.heroCard}><Text style={styles.heroEyebrow}>A FIVE-MINUTE PAUSE</Text><Text style={styles.heroTitle}>Start your{`\n`}reset</Text><Text style={styles.heroArrow}>→</Text><View style={styles.heroOrb} /></Pressable>{lastFeeling && <Text style={styles.returnNote}>Last time, you felt <Text style={styles.returnFeeling}>{lastFeeling.toLowerCase()}</Text>.</Text>}<View style={styles.sectionRow}><Text style={styles.sectionTitle}>Find your moment</Text><Text style={styles.sectionMore}>Explore all</Text></View><View style={styles.collectionList}>{collections.map((item) => <Pressable onPress={() => onCollection(item.key)} key={item.title} style={[styles.collection, { backgroundColor: item.color }]}><Text style={styles.collectionTitle}>{item.title}</Text><Text style={styles.collectionNote}>{item.note}</Text><Text style={styles.collectionArrow}>→</Text></Pressable>)}</View><View style={styles.weekCard}><Text style={styles.weekValue}>{completed}</Text><View><Text style={styles.weekTitle}>moments for yourself</Text><Text style={styles.weekNote}>this week. That matters.</Text></View></View></View>; }
function StatePicker({ onBack, onChoose }) { return <View><View style={styles.inlineHeader}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.shellTitle}>Start your reset</Text><View style={styles.backSpace} /></View><Text style={styles.largeTitle}>How is your body{`\n`}feeling right now?</Text><Text style={styles.body}>Choose what is closest. We’ll take it from there.</Text><View style={styles.stateGrid}>{Object.entries(rituals).map(([key, ritual]) => <Pressable key={key} onPress={() => onChoose(key)} style={[styles.stateCard, { backgroundColor: ritual.accent }]}><Text style={styles.stateIcon}>{ritual.icon}</Text><Text style={styles.stateTitle}>{key === 'pause' ? 'I need a pause' : `I feel ${key}`}</Text></Pressable>)}</View></View>; }
function Explore({ onCollection }) { return <View><Text style={styles.wordmarkDark}>inner talk</Text><Text style={styles.homeQuestion}>Find your{`\n`}moment.</Text><Text style={styles.body}>Small practices for the exact moment you are in.</Text><View style={styles.collectionList}>{collections.map((item) => <Pressable onPress={() => onCollection(item.key)} key={item.title} style={[styles.exploreCard, { backgroundColor: item.color }]}><Text style={styles.collectionTitle}>{item.title}</Text><Text style={styles.collectionNote}>{item.note}</Text><Text style={styles.exploreDuration}>5 min · guided ritual</Text></Pressable>)}</View></View>; }
function Progress({ completed, lastFeeling }) { return <View><Text style={styles.wordmarkDark}>inner talk</Text><Text style={styles.homeQuestion}>Your quiet{`\n`}return.</Text><View style={styles.progressCard}><Text style={styles.progressNumber}>{completed}</Text><Text style={styles.progressTitle}>rituals completed</Text><Text style={styles.body}>You have made room for yourself {completed} times this week.</Text></View><Text style={styles.sectionTitle}>This week</Text><View style={styles.dotRow}>{[0,1,2,3,4,5,6].map((x) => <View key={x} style={[styles.dayDot, x < Math.min(completed, 7) && styles.dayDotActive]}><Text style={styles.dayLabel}>{['M','T','W','T','F','S','S'][x]}</Text></View>)}</View>{lastFeeling && <View style={styles.reflection}><Text style={styles.cardTitle}>A small shift</Text><Text style={styles.cardNote}>After your last ritual, you felt {lastFeeling.toLowerCase()}.</Text></View>}</View>; }
function Profile({ reminders, setReminders }) { return <View><Text style={styles.wordmarkDark}>inner talk</Text><Text style={styles.homeQuestion}>Your space.</Text><View style={styles.profileBlock}><Text style={styles.profileHeading}>Ritual settings</Text><View style={styles.setting}><View><Text style={styles.cardTitle}>Daily reminder</Text><Text style={styles.cardNote}>5:30 PM</Text></View><Switch value={reminders} onValueChange={setReminders} trackColor={{ false: '#DBD9D2', true: '#294C45' }} /></View><View style={styles.setting}><Text style={styles.cardTitle}>Ambient sound</Text><Text style={styles.settingValue}>Soft rain</Text></View></View><View style={styles.profileBlock}><Text style={styles.profileHeading}>Your privacy</Text><Text style={styles.profileLink}>Manage your data</Text><Text style={styles.profileLink}>Privacy policy</Text><Text style={styles.profileLink}>Delete account</Text></View></View>; }
function Nav({ active, setScreen }) { const items = [['home','Home'], ['explore','Explore'], ['progress','Progress'], ['profile','Profile']]; return <View style={styles.nav}>{items.map(([key, label]) => <Pressable key={key} onPress={() => setScreen(key)} style={styles.navItem}><View style={[styles.navDot, active === key && styles.navDotActive]} /><Text style={[styles.navText, active === key && styles.navTextActive]}>{label}</Text></Pressable>)}</View>; }

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#FBFAF6' }, welcome: { flex: 1, backgroundColor: '#274E67', overflow: 'hidden' }, welcomeContent: { flex: 1, paddingHorizontal: 28, paddingBottom: 32, zIndex: 2 }, welcomeOrbOne: { position: 'absolute', height: 380, width: 380, borderRadius: 190, backgroundColor: '#6D8FB6', top: -110, right: -130, opacity: .72 }, welcomeOrbTwo: { position: 'absolute', height: 270, width: 270, borderRadius: 135, backgroundColor: '#A0D1C2', bottom: 55, left: -125, opacity: .8 }, wordmark: { fontSize: 18, letterSpacing: 2, color: '#F9F6ED', marginTop: 12 }, wordmarkDark: { fontSize: 16, letterSpacing: 2, color: '#294C45', marginBottom: 40 }, welcomeSpacer: { flex: 1 }, welcomeTitle: { color: '#F9F6ED', fontSize: 44, lineHeight: 49, letterSpacing: -.9, fontWeight: '400', marginBottom: 18 }, welcomeBody: { color: '#E6EDF0', fontSize: 17, lineHeight: 25, marginBottom: 34, maxWidth: 320 }, welcomeFootnote: { color: '#D6E0E3', fontSize: 12, textAlign: 'center', marginTop: 16 }, primaryButton: { backgroundColor: '#294C45', minHeight: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 }, primaryButtonInverse: { backgroundColor: '#F8F5EC' }, primaryButtonText: { color: '#F8F5EC', fontSize: 16, fontWeight: '600' }, primaryButtonTextInverse: { color: '#294C45' }, shellTop: { height: 64, paddingHorizontal: 22, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, back: { fontSize: 38, lineHeight: 40, color: '#294C45', fontWeight: '300' }, backSpace: { width: 28 }, shellTitle: { fontSize: 14, color: '#294C45', fontWeight: '600' }, screenBody: { flex: 1, paddingHorizontal: 26, paddingTop: 28 }, largeTitle: { color: '#294C45', fontSize: 34, lineHeight: 40, letterSpacing: -.7, fontWeight: '400', marginBottom: 14 }, body: { color: '#60706A', fontSize: 16, lineHeight: 24, marginBottom: 30 }, choiceStack: { gap: 10, marginTop: 10 }, choice: { backgroundColor: '#F0EEE6', minHeight: 61, borderRadius: 15, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, choiceSelected: { backgroundColor: '#D7E9E1', borderWidth: 1, borderColor: '#294C45' }, choiceText: { color: '#294C45', fontSize: 16 }, choiceTextSelected: { fontWeight: '600' }, choiceArrow: { fontSize: 26, color: '#668078' }, bottomAction: { marginTop: 'auto', marginBottom: 32 }, ritualGlyph: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#D7E9E1', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }, glyphText: { fontSize: 34, color: '#294C45' }, reminderCard: { backgroundColor: '#F0EEE6', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cardTitle: { color: '#294C45', fontSize: 16, fontWeight: '600' }, cardNote: { color: '#708078', fontSize: 14, marginTop: 5 }, player: { flex: 1, paddingHorizontal: 28 }, playerTop: { paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, close: { fontSize: 36, color: '#294C45', fontWeight: '200' }, playerDuration: { color: '#294C45', fontWeight: '600', fontSize: 14 }, playerMain: { flex: 1, justifyContent: 'center', alignItems: 'center' }, playerCircle: { width: 218, height: 218, borderRadius: 109, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.26)', marginBottom: 50 }, playerInnerCircle: { width: 156, height: 156, borderRadius: 78, backgroundColor: 'rgba(255,255,255,.28)', justifyContent: 'center', alignItems: 'center' }, playerIcon: { fontSize: 54, color: '#294C45' }, playerEyebrow: { color: '#46675F', fontSize: 11, letterSpacing: 1.2, fontWeight: '600', marginBottom: 12 }, playerTitle: { color: '#294C45', fontSize: 35, lineHeight: 40, textAlign: 'center', letterSpacing: -.7, marginBottom: 12 }, playerBody: { color: '#46675F', fontSize: 16, lineHeight: 23, textAlign: 'center', maxWidth: 320 }, playerBottom: { paddingBottom: 32 }, progressTrack: { backgroundColor: 'rgba(41,76,69,.16)', height: 4, borderRadius: 3, marginBottom: 20 }, progressFill: { height: 4, width: '16%', backgroundColor: '#294C45', borderRadius: 3 }, playerPrompt: { color: '#46675F', fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 22, fontStyle: 'italic' }, checkinTop: { marginTop: 22, marginBottom: 12 }, checkinSymbol: { color: '#294C45', fontSize: 38, marginBottom: 22 }, supportText: { color: '#87938E', fontSize: 12, lineHeight: 17, marginTop: 22 }, homeScroll: { padding: 26, paddingBottom: 106 }, homeGreeting: { color: '#71817A', fontSize: 16, marginBottom: 7 }, homeQuestion: { color: '#294C45', fontSize: 37, lineHeight: 42, letterSpacing: -.9, marginBottom: 26 }, heroCard: { minHeight: 206, borderRadius: 24, padding: 23, backgroundColor: '#294C45', overflow: 'hidden', marginBottom: 16 }, heroEyebrow: { color: '#B7D8CD', fontSize: 11, letterSpacing: 1.1, fontWeight: '600', zIndex: 2 }, heroTitle: { color: '#FAF8F0', fontSize: 33, lineHeight: 37, letterSpacing: -.7, marginTop: 18, zIndex: 2 }, heroArrow: { color: '#FAF8F0', fontSize: 28, marginTop: 10, zIndex: 2 }, heroOrb: { width: 185, height: 185, borderRadius: 93, backgroundColor: '#79A49B', position: 'absolute', right: -43, bottom: -58, opacity: .75 }, returnNote: { color: '#71817A', fontSize: 14, marginBottom: 25 }, returnFeeling: { color: '#294C45', fontWeight: '600' }, sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, sectionTitle: { color: '#294C45', fontSize: 20, fontWeight: '500' }, sectionMore: { color: '#71817A', fontSize: 13 }, collectionList: { gap: 10 }, collection: { padding: 17, borderRadius: 17, minHeight: 104, overflow: 'hidden' }, collectionTitle: { color: '#294C45', fontSize: 20, fontWeight: '500' }, collectionNote: { color: '#46675F', fontSize: 13, marginTop: 5 }, collectionArrow: { color: '#294C45', fontSize: 23, position: 'absolute', right: 16, bottom: 11 }, weekCard: { backgroundColor: '#F0EEE6', borderRadius: 17, padding: 18, marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 15 }, weekValue: { color: '#294C45', fontSize: 38, lineHeight: 42 }, weekTitle: { color: '#294C45', fontSize: 15, fontWeight: '600' }, weekNote: { color: '#71817A', fontSize: 13, marginTop: 3 }, nav: { minHeight: 78, backgroundColor: '#FFFEFB', borderTopWidth: 1, borderTopColor: '#E8E4DA', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 11, paddingBottom: 8 }, navItem: { alignItems: 'center', minWidth: 55 }, navDot: { height: 5, width: 5, borderRadius: 3, backgroundColor: '#C6CEC9', marginBottom: 6 }, navDotActive: { backgroundColor: '#294C45', width: 18 }, navText: { color: '#8A9791', fontSize: 11 }, navTextActive: { color: '#294C45', fontWeight: '600' }, inlineHeader: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, stateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }, stateCard: { width: '48%', minHeight: 145, borderRadius: 18, padding: 16, justifyContent: 'space-between' }, stateIcon: { fontSize: 30, color: '#294C45' }, stateTitle: { color: '#294C45', fontSize: 17, lineHeight: 21, maxWidth: 110 }, exploreCard: { minHeight: 132, borderRadius: 18, padding: 18 }, exploreDuration: { color: '#46675F', fontSize: 12, marginTop: 28 }, progressCard: { padding: 24, backgroundColor: '#D7E9E1', borderRadius: 22, marginBottom: 34 }, progressNumber: { color: '#294C45', fontSize: 58, lineHeight: 61 }, progressTitle: { color: '#294C45', fontSize: 19, marginBottom: 12, fontWeight: '500' }, dotRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 36 }, dayDot: { alignItems: 'center', gap: 10 }, dayLabel: { fontSize: 12, color: '#71817A' }, dayDotActive: { }, reflection: { padding: 19, backgroundColor: '#F0EEE6', borderRadius: 17 }, profileBlock: { marginBottom: 30 }, profileHeading: { color: '#71817A', textTransform: 'uppercase', letterSpacing: 1.1, fontSize: 11, marginBottom: 10, fontWeight: '600' }, setting: { borderTopWidth: 1, borderTopColor: '#E6E1D6', paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, settingValue: { color: '#71817A', fontSize: 14 }, profileLink: { borderTopWidth: 1, borderTopColor: '#E6E1D6', paddingVertical: 16, color: '#294C45', fontSize: 16 }
});
