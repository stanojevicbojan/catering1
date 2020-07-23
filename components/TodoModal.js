import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput } from 'react-native';
import { AntDesign, Ionicons, Fontisto } from '@expo/vector-icons'
import colors from '../Colors'
import firebase from '../database/firebaseDb';
import { SwipeListView } from 'react-native-swipe-list-view';


export default class TodoModal extends React.Component {
    state = {
        newTodo: ""
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


  render() {
      const list = this.props.list
      
      const taskCount = list.todos == undefined ? 0 : list.todos.length
      const completedCount = list.todos == undefined ? 0 : list.todos.filter(todo => todo.completed).length

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={{position: "absolute", top: 1, right: 32, zIndex: 10}}
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                    <View>
                        <TouchableOpacity onPress={() => this.resetShoppingList()}><Text>Reset list</Text></TouchableOpacity>
                        <Text style={styles.title}>{list.name}</Text>
                        <Text style={styles.taskCount}>
                            {completedCount} of {taskCount} tasks
                        </Text>
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
                                <View style={styles.checkmark}>
                                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                                    <Fontisto name={list.todos[index].completed == true ? 'checkbox-passive' : 'checkbox-active'} size={25} color={colors.gray} />
                                    </TouchableOpacity>
                                </View>
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
        marginTop: 40,
    },
    section: {
        flex: 1,
        alignSelf: 'stretch'
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 64,
        borderBottomWidth: 3
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.black,
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
    addToCart: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addAllToCart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#009faf',
        padding: 10,
        borderRadius: 20,
        marginBottom: -8,
        marginLeft: -40,
        marginRight: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})