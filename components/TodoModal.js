import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import { AntDesign, Ionicons, Fontisto } from '@expo/vector-icons'
import colors from '../Colors'
import firebase from '../database/firebaseDb';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Button, Paragraph, Dialog, Portal, Provider, Chip } from 'react-native-paper';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native-gesture-handler';


export default class TodoModal extends React.Component {
    constructor(props) {
        super(props);

        let test = []
        this.state = {
            newTodo: "",
            expoPushToken: '',
            usersTokens: [],
            favorites: []
        }
    }
    componentDidMount() {
        // run function to send push notifications on mount
        this.registerForPushNotificationsAsync()
        this.getAllTokens()
        this.favoritesList = firebase.firestore().collection('lists').onSnapshot(snap => {
            let myItems = {}
            let favorites = {}
            let onlyTrue = []
            snap.forEach(item => {
              myItems[item.id] = item.data().favorites
              favorites = myItems.favorites
              const result = Object.keys(favorites)
                .reduce((o, key) => {
                    favorites[key] == true && (o[key] = favorites[key]);

                    return o;
                }, {});
              onlyTrue = Object.keys(result)
            })
            this.setState({favorites: onlyTrue})
          })
    }

    componentWillUnmount() {
        this.favoritesList();
    }

    toggleTodoCompleted = index => {
        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed
        this.props.updateList(list)
    }

    increaseAmount = index => {
        let list = this.props.list
        list.todos[index].counter = list.todos[index].counter + 1
        this.props.updateList(list)
    }

    decreaseAmount = index => {
        let list = this.props.list
        if (list.todos[index].counter > 0 ) {
        list.todos[index].counter = list.todos[index].counter - 1
        } else if (list.todos[index].counter == 0) {
            list.todos[index].counter == 0
        }
        this.props.updateList(list)  
    }

    addTodo = () => {
        let list = this.props.list
        list.todos.push({title: this.state.newTodo, completed: false, counter:1})

        this.props.updateList(list)
        this.setState({newTodo: "" })

        //if dismissing keyboard is needed
        //Keyboard.dismiss()
    }

    addFromFavorites = (item) => {
        let list = this.props.list
        list.todos.push({title: item, completed: false, counter:1})

        this.props.updateList(list)

        //if dismissing keyboard is needed
        //Keyboard.dismiss()
    }

    deleteTodo = index => {
        let list = this.props.list

        list.todos.splice(index, 1)

        this.props.updateList(list)
    }

    //resets current items in the Shopping list
    resetShoppingList() {
        //get all available tokens
        const docRef = firebase.firestore().collection('users').doc('1mXHCyEEYnhyIqiqyeqi').collection('lists').doc('PHctNyYf5MHyofyNkW2j')

        // Reset todos in the Shopping list
        docRef.update({todos: firebase.firestore.FieldValue.delete()
        });
        docRef.update({todos: []
        });
        
    }

    resetPurchaseRequestList() {
        //get all available tokens
        const docRef = firebase.firestore().collection('users').doc('1mXHCyEEYnhyIqiqyeqi').collection('lists').doc('NVHD5c3FmQY8AMuHqFwr')

        // Reset todos in the Shopping list
        docRef.update({todos: firebase.firestore.FieldValue.delete()
        });
        docRef.update({todos: []
        });
        
    }

    renderTodo = (todo, index) => {
        return (
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                            <Ionicons name={todo.completed? 'ios-square' : 'ios-square-outline'} size={24} color={colors.gray} />
                    </TouchableOpacity>
                    <Text style={[styles.todo, {
                            textDecorationLine: todo.completed ? 'line-through' : "none", 
                            color: todo.completed ? colors.gray : colors.black}]}>{todo.title
                            }
                    </Text>
                    

                    <TouchableOpacity style={styles.deleteContainer} onPress={() => this.deleteTodo(index)}>
                            <Ionicons style={styles.deleteButton} name={'md-trash'} size={38} color={colors.gray} />
                    </TouchableOpacity>
                </View>
        )
    }

    createTwoButtonAlert = () =>
    Alert.alert(
      "Reset confirmation",
      "Are you sure you want to create new shopping list? \n \nThis will delete all items in the shopping list.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.resetShoppingList() }
      ],
      { cancelable: false }
    );

    registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = await Notifications.getExpoPushTokenAsync();
          this.setState({ expoPushToken: token });
        }

        firebase.firestore().collection('notifications').doc('pushTokens').update({tokens: firebase.firestore.FieldValue.arrayUnion(this.state.expoPushToken)}).then(function() {
            console.log("Document successfully written!");
        });
      
        if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }
    };  

    getAllTokens = () => {
        //get all available tokens
        const docRef = firebase.firestore().collection('notifications').doc('pushTokens').get().then((doc) => {
                if (doc.exists) {
                    const {
                        tokens
                    } = doc.data();
                    
                    this.setState({
                    usersTokens: tokens
                    })
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document found!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
    } 

    sendPushNotification = async () => {
        for (let i = 0; i < this.state.usersTokens.length; i++) {
            const message = {
                to: this.state.usersTokens[i],
                sound: 'default',
                title: 'Shopping cart updated',
                body: 'New items added to shopping cart!',
                data: { data: 'goes here' },
                };
                
                await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
                });
        }
    } 

    //adds all items from the array to shopping list 
    addAllToShoppingList = () => {
        let list = this.props.list
        for ( let i=0; i<list.todos.length; i++) {
        firebase.firestore().collection('users').doc('1mXHCyEEYnhyIqiqyeqi').collection('lists').doc('PHctNyYf5MHyofyNkW2j').update({todos: firebase.firestore.FieldValue.arrayUnion({"completed": true, "title": list.todos[i].title, "counter": list.todos[i].counter})})
        }
        alert("Items added to shopping list!")
    }

    singleFavorite = () => (
        <Chip icon="information" onPress={() => console.log('Pressed')}>Example Chip</Chip>
      );

  render() {
      const list = this.props.list
      
      const taskCount = list.todos == undefined ? 0 : list.todos.length 
      const completedCount = list.todos == undefined ? 0 : list.todos.filter(todo => todo.completed).length

    return (
        <KeyboardAvoidingView style={{flex: 1, marginTop: 30,}} behavior="height">
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={{position: "absolute", top: 30, right: 32, zIndex: 10}}
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                    <View>
                        
                        {list.name == 'Shopping list' ?
                        <View> 
                        <Button style={styles.sendRequestButton} icon="delete" mode="contained" onPress={() => this.createTwoButtonAlert()}>Reset list</Button>
                        </View>
                        :
                        <Button style={styles.sendRequestButton} icon="send" mode="contained" onPress={() => {this.addAllToShoppingList(); this.resetPurchaseRequestList(); this.sendPushNotification()}}>Send request</Button>
                        }
                        
                        <Text style={styles.title}>{list.name}</Text>
                        {list.name == 'Shopping list' ? 
                            <Text style={styles.taskCount}>
                            {completedCount} items left to purchase!
                            </Text>: null
                        }
                    </View>
                </View>
                <View style={[styles.section, {flex: 5}]}>
                    <SwipeListView
                            data={list.todos}
                            renderItem={({ item, index }) => 
                            <View style={styles.rowFront}>
                                <View style={styles.listItems}>
                                    <TouchableOpacity  onPress={() => this.decreaseAmount(index)}>
                                    <Ionicons name={'ios-remove-circle'} size={38} color={"#E1E2E1"} />
                                    </TouchableOpacity>
                                    <Text style={styles.counterText}>{item.counter}</Text>
                                    <TouchableOpacity  onPress={() => this.increaseAmount(index)}>
                                    <Ionicons name={'ios-add-circle'} size={38} color={"#E1E2E1"} />
                                    </TouchableOpacity>
                                    <Text style={[styles.todo]}>{item.title}</Text>
                                </View>
                                {list.name == 'Shopping list' ?
                                <View style={styles.checkmark}>
                                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                                    <Ionicons name={list.todos[index].completed == true ? 'ios-square-outline' : 'md-checkbox'} size={25} color={colors.gray} />
                                    </TouchableOpacity>
                                </View>
                                :
                                null}
                            </View>
                            }
                            //this.renderTodo(item, index)}
                            renderHiddenItem={({ item, index }) => (
                                <View style={styles.rowBack}>
                                    <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                                    onPress={() => this.deleteTodo(index)}
                                    >
                                    <Text style={styles.backTextWhite}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(_, index) => index.toString()}
                            
                            rightOpenValue={-75}
                            contentContainerStyle={{paddingHorizontal: 32, paddingVertical: 64}}
                            showsVerticalScrollIndicator={false}
                        />
                </View>
                {
                    list.name !== 'Shopping list' ?
                    <View style={styles.favorites}>
                        <SwipeListView
                            data={this.state.favorites}
                            renderItem={({ item, index }) => 
                                <View>
                                    <Chip style={{margin: 3}} icon="star" onPress={() => this.addFromFavorites(item)} onClose={() => console.log('remove from favorites')}>{item}</Chip>
                                </View>
                            }
                            keyExtractor={(_, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    :
                    null
                }
                { list.name !== 'Shopping list' ? 
                    <View style={[styles.section, styles.footer]}>
                        <TextInput 
                            style={[styles.input, {borderColor: list.color}]}
                            onChangeText={text => this.setState({newTodo: text})}
                            value={this.state.newTodo}
                        />
                        <TouchableOpacity
                            style={[styles.addTodo, {backgroundColor: list.color}]}
                            onPress={() => this.addTodo()}
                        >
                            <AntDesign name="plus" size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
                
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 10,
    },
    section: {
        flex: 1,
        alignSelf: 'stretch'
    },
    header: {
        marginLeft: 14,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 5
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: "700"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    todo: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8,
        maxWidth: 230,
        alignSelf: 'center',
    },
    deleteContainer: {
        flex: 1,
    },
    deleteButton: {
        alignSelf: 'flex-end'
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fffffe',
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 1,
        borderTopColor: '#f1f1f1',
        borderTopWidth: 1,
        height: 50,
        marginBottom: 5,
    },
    listItems: {
        flexDirection: 'row',
        flex: 1,
    },
    checkmark: {
        marginRight: 10,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginBottom: 6,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    counterText: {
        fontSize: 25,
        marginRight: 10,
        marginLeft: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sendRequestButton: {
        width: 170,
    },
    resetButton: {
        marginTop: 50,
    },
    favorites: {
        flex: 1,
        alignSelf: 'stretch',
        paddingHorizontal: 0,
        paddingLeft: 32,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: -20,
    }
})